use crate::entities::user::{User, UserInput};
use anyhow::Result;
use async_trait::async_trait;

#[async_trait]
pub trait UsersRepositoryTrait {
    async fn save(&self, input: UserInput) -> Result<User>;
    async fn delete(&self, id: i32) -> Result<User>;
    async fn list(&self) -> Result<Vec<User>>;
    async fn find_by_id(&self, id: i32) -> Result<Option<User>>;
    async fn find_by_email(&self, email: String) -> Result<Option<User>>;
}
