use crate::entities::order::{Order, OrderInput};
use anyhow::Result;
use async_trait::async_trait;
use uuid::Uuid;

#[async_trait]
pub trait OrdersRepositoryTrait {
    async fn save(&self, input: OrderInput) -> Result<Order>;
    async fn delete(&self, id: Uuid) -> Result<Order>;
    async fn list(&self) -> Result<Vec<Order>>;
    async fn find_by_id(&self, id: Uuid) -> Result<Option<Order>>;
}
