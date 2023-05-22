use crate::database::RepositoryProvider;
use crate::entities::order::{Order, OrderInput};
use crate::entities::product::{Product, ProductInput};
use crate::entities::user::{User, UserInput};
use crate::usecases::order;
use crate::usecases::product;
use crate::usecases::user;
use anyhow::Result;
use async_graphql::{Context, Object};
use uuid::Uuid;

pub struct Mutation;

#[Object]
impl Mutation {
    async fn create_order(&self, ctx: &Context<'_>, input: OrderInput) -> Result<Order> {
        let repo = ctx.data::<RepositoryProvider>().unwrap();
        order::create(repo, input).await
    }

    async fn delete_order(&self, ctx: &Context<'_>, id: Uuid) -> Result<Order> {
        let repo = ctx.data::<RepositoryProvider>().unwrap();
        order::delete(repo, id).await
    }

    async fn create_product(&self, ctx: &Context<'_>, input: ProductInput) -> Result<Product> {
        let repo = ctx.data::<RepositoryProvider>().unwrap();
        product::save(repo, input).await
    }

    async fn delete_product(&self, ctx: &Context<'_>, id: i32) -> Result<Product> {
        let repo = ctx.data::<RepositoryProvider>().unwrap();
        product::delete(repo, id).await
    }

    async fn create_user(&self, ctx: &Context<'_>, input: UserInput) -> Result<User> {
        let repo = ctx.data::<RepositoryProvider>().unwrap();
        user::save(repo, input).await
    }

    async fn delete_user(&self, ctx: &Context<'_>, id: i32) -> Result<User> {
        let repo = ctx.data::<RepositoryProvider>().unwrap();
        user::delete_user(repo, id).await
    }
}
