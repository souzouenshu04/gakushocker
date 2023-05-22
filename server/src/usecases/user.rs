use crate::database::RepositoryProvider;
use crate::entities::user::{User, UserInput};
use crate::services::user as UserServices;
use anyhow::Result;

pub async fn save(repo: &RepositoryProvider, input: UserInput) -> Result<User> {
    UserServices::save(repo.users(), input).await
}

pub async fn delete_user(repo: &RepositoryProvider, id: i32) -> Result<User> {
    UserServices::delete(repo.users(), id).await
}

pub async fn list_user(repo: &RepositoryProvider) -> Result<Vec<User>> {
    UserServices::list(repo.users()).await
}

pub async fn find_user_by_email(repo: &RepositoryProvider, email: String) -> Result<Option<User>> {
    let user = UserServices::find_by_email(repo.users(), email).await?;
    Ok(user)
}

pub async fn find_user_by_user_id(repo: &RepositoryProvider, id: i32) -> Result<Option<User>> {
    let user = UserServices::find_by_id(repo.users(), id).await?;
    Ok(user)
}

#[cfg(test)]
mod tests {
    use crate::database::{db_pool, RepositoryProvider};
    use crate::entities::user::{User, UserInput};
    use crate::usecases::user;
    use anyhow::Result;
    use fake::faker::name::raw::*;
    use fake::locales::*;
    use fake::{Fake, Faker};

    #[tokio::test]
    async fn test_usecases_save_and_delete() -> Result<()> {
        let pool = db_pool().await;
        let tx = pool.begin().await?;
        let repo = RepositoryProvider(pool.into());
        let user_input = UserInput {
            display_name: Name(EN).fake(),
            email: Name(EN).fake(),
            password: Faker.fake(),
            point: 100,
            is_admin: false,
        };
        let saved_user = user::save(&repo, user_input.clone()).await?;
        let expected_user = User {
            id: saved_user.id,
            display_name: user_input.display_name,
            email: user_input.email,
            password: user_input.password,
            point: 100,
            is_admin: false,
        };
        assert_eq!(expected_user, saved_user);

        let deleted_user = user::delete_user(&repo, saved_user.id).await?;
        assert_eq!(expected_user, deleted_user);

        tx.rollback().await?;
        Ok(())
    }

    #[tokio::test]
    async fn test_usecases_find_by_email() -> Result<()> {
        let pool = db_pool().await;
        let repo = RepositoryProvider(pool.into());

        let found_user = user::find_user_by_email(&repo, "demo".to_string()).await?;
        assert!(found_user.is_some());
        Ok(())
    }

    #[tokio::test]
    async fn test_usecases_find_by_id() -> Result<()> {
        let pool = db_pool().await;
        let repo = RepositoryProvider(pool.into());

        let found_user = user::find_user_by_user_id(&repo, 1).await?;
        assert!(found_user.is_some());
        Ok(())
    }
}
