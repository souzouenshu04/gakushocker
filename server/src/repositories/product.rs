use crate::entities::product::{Product, ProductInput};
use anyhow::Result;
use async_trait::async_trait;

#[async_trait]
pub trait ProductsRepositoryTrait {
    async fn save(&self, input: ProductInput) -> Result<Product>;
    async fn delete(&self, id: i32) -> Result<Product>;
    async fn list(&self) -> Result<Vec<Product>>;
    async fn find_by_id(&self, id: i32) -> Result<Option<Product>>;
}
