use crate::entities::user::{User, UserInput};
use crate::repositories::user::UsersRepositoryTrait;
use anyhow::Result;

pub async fn save(repo: impl UsersRepositoryTrait, input: UserInput) -> Result<User> {
    repo.save(input).await
}

pub async fn delete(repo: impl UsersRepositoryTrait, id: i32) -> Result<User> {
    repo.delete(id).await
}

pub async fn list(repo: impl UsersRepositoryTrait) -> Result<Vec<User>> {
    repo.list().await
}

pub async fn find_by_id(repo: impl UsersRepositoryTrait, id: i32) -> Result<Option<User>> {
    repo.find_by_id(id).await
}

pub async fn find_by_email(repo: impl UsersRepositoryTrait, email: String) -> Result<Option<User>> {
    repo.find_by_email(email).await
}
