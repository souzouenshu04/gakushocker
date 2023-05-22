use crate::entities::product::{Product, ProductInput};
use crate::repositories::product::ProductsRepositoryTrait;
use anyhow::Result;

pub async fn save(repo: impl ProductsRepositoryTrait, input: ProductInput) -> Result<Product> {
    repo.save(input).await
}

pub async fn delete(repo: impl ProductsRepositoryTrait, id: i32) -> Result<Product> {
    repo.delete(id).await
}

pub async fn list(repo: impl ProductsRepositoryTrait) -> Result<Vec<Product>> {
    repo.list().await
}

pub async fn find_by_id(repo: impl ProductsRepositoryTrait, id: i32) -> Result<Option<Product>> {
    repo.find_by_id(id).await
}
