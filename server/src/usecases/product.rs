use crate::database::RepositoryProvider;
use crate::entities::product::{Product, ProductInput};
use crate::services::product as ProductServices;
use anyhow::Result;

pub async fn save(repo: &RepositoryProvider, input: ProductInput) -> Result<Product> {
    ProductServices::save(repo.products(), input).await
}

pub async fn delete(repo: &RepositoryProvider, id: i32) -> Result<Product> {
    ProductServices::delete(repo.products(), id).await
}

pub async fn find_product_by_id(repo: &RepositoryProvider, id: i32) -> Result<Option<Product>> {
    let all_product = ProductServices::list(repo.products()).await?;
    let product = all_product.into_iter().find(|product| product.id == id);
    Ok(product)
}

pub async fn list_product(repo: &RepositoryProvider) -> Result<Vec<Product>> {
    ProductServices::list(repo.products()).await
}

#[cfg(test)]
mod tests {
    use crate::database::{db_pool, RepositoryProvider};
    use crate::entities::product::{Product, ProductInput};
    use crate::usecases::product;
    use anyhow::Result;

    #[tokio::test]
    async fn test_usecases_product_save_and_delete() -> Result<()> {
        let pool = db_pool().await;
        let tx = pool.begin().await?;
        let repo = RepositoryProvider(pool.into());
        let input_product = ProductInput {
            name: "test丼".to_string(),
            price: 400,
            stock: 100,
        };
        let saved_product = product::save(&repo, input_product.clone()).await?;
        let expect_product = Product {
            id: saved_product.id,
            name: "test丼".to_string(),
            price: 400,
            stock: 100,
        };
        assert_eq!(expect_product.clone(), saved_product);

        let id = saved_product.id;
        let deleted_product = product::delete(&repo, id).await?;
        assert_eq!(expect_product, deleted_product);

        tx.rollback().await?;
        Ok(())
    }

    #[tokio::test]
    async fn test_usecases_product_find_product_by_id() -> Result<()> {
        let pool = db_pool().await;
        let tx = pool.begin().await?;
        let repo = RepositoryProvider(pool.into());
        let expected_product = Product {
            id: 1,
            name: "定食A".to_string(),
            price: 420,
            stock: 100,
        };
        let found_product = product::find_product_by_id(&repo, expected_product.id).await?;
        assert!(found_product.is_some());

        tx.rollback().await?;
        Ok(())
    }

    #[tokio::test]
    async fn test_usecases_product_list_products() -> Result<()> {
        let pool = db_pool().await;
        let tx = pool.begin().await?;
        let repo = RepositoryProvider(pool.into());
        let expected_product = Product {
            id: 1,
            name: "定食A".to_string(),
            price: 420,
            stock: 100,
        };
        let products = product::list_product(&repo).await?;
        assert!(products.contains(&expected_product));

        tx.rollback().await?;
        Ok(())
    }
}
