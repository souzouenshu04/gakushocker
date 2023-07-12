use crate::database::ConnectionPool;
use crate::entities::user::{User, UserInput};
use crate::repositories::user::UsersRepositoryTrait;
use anyhow::Result;

pub struct UsersRepository<'a> {
    pub pool: &'a ConnectionPool,
}

#[async_trait::async_trait]
impl<'a> UsersRepositoryTrait for UsersRepository<'a> {
    async fn save(&self, input: UserInput) -> Result<User> {
        let pool = self.pool;
        let sql = r#"
            INSERT INTO
                users (display_name, email, password, point, is_admin)
            VALUES
                ($1, $2, $3, $4, $5)
            ON CONFLICT
                (email)
            DO UPDATE SET
                display_name=EXCLUDED.display_name,
                email=EXCLUDED.email,
                password=EXCLUDED.password,
                point=EXCLUDED.point,
                is_admin=EXCLUDED.is_admin
            RETURNING
                id, display_name, email, password, point, is_admin
        "#;
        let mut tx = pool.begin().await?;
        let saved_user: User = match sqlx::query_as(sql)
            .bind(input.display_name)
            .bind(input.email)
            .bind(input.password)
            .bind(input.point)
            .bind(input.is_admin)
            .fetch_one(&mut tx)
            .await
        {
            Ok(u) => u,
            Err(e) => {
                tx.rollback().await?;
                return Err(e.into());
            }
        };
        tx.commit().await?;
        Ok(saved_user)
    }

    async fn delete(&self, id: i32) -> Result<User> {
        let pool = self.pool;
        let sql = r#"
            DELETE FROM
                users
            WHERE
                id=$1
            RETURNING
                id, display_name, email, password, point, is_admin
        "#;
        let mut tx = pool.begin().await?;
        let deleted_user: User = match sqlx::query_as(sql).bind(id).fetch_one(&mut tx).await {
            Ok(u) => u,
            Err(e) => {
                tx.rollback().await?;
                return Err(e.into());
            }
        };
        tx.commit().await?;
        Ok(deleted_user)
    }

    async fn list(&self) -> Result<Vec<User>> {
        let pool = self.pool;
        let sql = "SELECT * FROM users";
        let users = match sqlx::query_as(sql).fetch_all(pool).await {
            Ok(u_vec) => u_vec,
            Err(e) => return Err(e.into()),
        };
        Ok(users)
    }

    async fn find_by_id(&self, id: i32) -> Result<Option<User>> {
        let pool = self.pool;
        let sql = "SELECT * FROM users WHERE id=$1";
        let user = match sqlx::query_as(sql).bind(id).fetch_optional(pool).await {
            Ok(u) => u,
            Err(e) => return Err(e.into()),
        };
        Ok(user)
    }

    async fn find_by_email(&self, email: String) -> Result<Option<User>> {
        let pool = self.pool;
        let sql = "SELECT * FROM users WHERE email=$1";
        let user = match sqlx::query_as(sql).bind(email).fetch_optional(pool).await {
            Ok(u) => u,
            Err(e) => return Err(e.into()),
        };
        Ok(user)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::database::db_pool;
    use anyhow::Result;
    use fake::{Fake, Faker};

    #[tokio::test]
    async fn test_user_repository() -> Result<()> {
        let pool = db_pool().await;
        let user_impl = UsersRepository { pool: &pool };
        let user_input: UserInput = Faker.fake();
        let tx = pool.begin().await?;
        let saved_user = user_impl.save(user_input.clone()).await.unwrap();
        let expected_user = User {
            id: saved_user.id,
            display_name: user_input.display_name,
            email: user_input.email,
            password: user_input.password,
            point: user_input.point,
            is_admin: user_input.is_admin,
        };
        assert_eq!(expected_user, saved_user);
        let all_user = user_impl.list().await.unwrap();
        let expect_found_user = expected_user;
        let found_user = all_user
            .into_iter()
            .find(|user| user.id == expect_found_user.id);
        assert!(found_user.is_some());
        let expect_delete_user = expect_found_user;
        let deleted_user = user_impl.delete(saved_user.id).await.unwrap();
        assert_eq!(expect_delete_user, deleted_user);
        tx.rollback().await?;
        Ok(())
    }
}
