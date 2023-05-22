use crate::entities::order::{Order, OrderInput};
use crate::repositories::order::OrdersRepositoryTrait;
use anyhow::Result;
use uuid::Uuid;

pub async fn save(repo: impl OrdersRepositoryTrait, input: OrderInput) -> Result<Order> {
    repo.save(input).await
}

pub async fn delete(repo: impl OrdersRepositoryTrait, id: Uuid) -> Result<Order> {
    repo.delete(id).await
}

pub async fn list(repo: impl OrdersRepositoryTrait) -> Result<Vec<Order>> {
    repo.list().await
}

pub async fn find_by_id(repo: impl OrdersRepositoryTrait, id: Uuid) -> Result<Option<Order>> {
    repo.find_by_id(id).await
}
