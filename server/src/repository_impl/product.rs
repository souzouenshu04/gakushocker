use crate::database::ConnectionPool;
use crate::entities::product::{Product, ProductInput};
use crate::repositories::product::ProductsRepositoryTrait;
use anyhow::Result;

pub struct ProductsRepository<'a> {
    pub pool: &'a ConnectionPool,
}

#[axum::async_trait]
impl<'a> ProductsRepositoryTrait for ProductsRepository<'a> {
    async fn save(&self, input: ProductInput) -> Result<Product> {
        let pool = self.pool;
        let sql = r#"
            INSERT INTO
                products (name, price, stock)
            VALUES
                ($1, $2, $3)
            ON CONFLICT
                (name)
            DO UPDATE SET
                price=EXCLUDED.price,
                stock=EXCLUDED.stock
            RETURNING
                id, name, price, stock;
        "#;
        let mut tx = pool.begin().await?;
        let saved_product: Product = match sqlx::query_as(sql)
            .bind(input.name)
            .bind(input.price)
            .bind(input.stock)
            .fetch_one(&mut tx)
            .await
        {
            Ok(p) => p,
            Err(e) => {
                tx.rollback().await?;
                return Err(e.into());
            }
        };
        tx.commit().await?;
        Ok(saved_product)
    }

    async fn delete(&self, id: i32) -> Result<Product> {
        let pool = self.pool;
        let sql = r#"
            DELETE FROM
                products
            WHERE
                id=$1
            RETURNING
                id, name, price, stock;
        "#;
        let mut tx = pool.begin().await.unwrap();
        let deleted_product: Product = match sqlx::query_as(sql).bind(id).fetch_one(&mut tx).await
        {
            Ok(p) => p,
            Err(e) => {
                tx.rollback().await?;
                return Err(e.into());
            }
        };
        tx.commit().await.unwrap();
        Ok(deleted_product)
    }

    async fn list(&self) -> Result<Vec<Product>> {
        let pool = self.pool;
        let sql = "SELECT * FROM products ORDER BY id ASC";
        let products: Vec<Product> = match sqlx::query_as(sql).fetch_all(pool).await {
            Ok(p_vec) => p_vec,
            Err(e) => return Err(e.into()),
        };
        Ok(products)
    }

    async fn find_by_id(&self, id: i32) -> Result<Option<Product>> {
        let pool = self.pool;
        let sql = "SELECT * FROM products WHERE id=$1";
        let product: Option<Product> =
            match sqlx::query_as(sql).bind(id).fetch_optional(pool).await {
                Ok(p) => p,
                Err(e) => return Err(e.into()),
            };
        Ok(product)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::database::db_pool;
    use anyhow::Result;
    use fake::{Fake, Faker};

    #[tokio::test]
    async fn test_product_repository() -> Result<()> {
        let pool = db_pool().await;
        let product_impl = ProductsRepository { pool: &pool };
        let product_input: ProductInput = Faker.fake();

        let tx = pool.begin().await.unwrap();
        let saved_product = product_impl.save(product_input.clone()).await.unwrap();

        let expected_product = Product {
            id: saved_product.id,
            name: product_input.name,
            price: product_input.price,
            stock: product_input.stock,
        };
        assert_eq!(expected_product, saved_product);
        let expected_found_product = expected_product.clone();
        let all_product = product_impl.list().await.unwrap();
        let found_product = all_product
            .into_iter()
            .find(|product| product.id == expected_found_product.id);
        assert!(found_product.is_some());

        let deleted_product = product_impl.delete(saved_product.id).await.unwrap();
        assert_eq!(expected_product, deleted_product);
        tx.rollback().await?;
        Ok(())
    }
}
