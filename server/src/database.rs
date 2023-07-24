use crate::constants;
use crate::repository_impl::order::OrdersRepository;
use crate::repository_impl::product::ProductsRepository;
use crate::repository_impl::user::UsersRepository;
use sqlx::postgres::PgPoolOptions;
use sqlx::{Pool, Postgres};
use std::sync::Arc;

pub type ConnectionPool = Pool<Postgres>;

#[derive(Clone)]
pub struct RepositoryProvider(pub Arc<ConnectionPool>);

impl RepositoryProvider {
    pub fn orders(&self) -> OrdersRepository {
        OrdersRepository { pool: &self.0 }
    }
    pub fn products(&self) -> ProductsRepository {
        ProductsRepository { pool: &self.0 }
    }
    pub fn users(&self) -> UsersRepository {
        UsersRepository { pool: &self.0 }
    }
}

pub async fn db_pool() -> ConnectionPool {
    let db_url = constants::db_url();
    PgPoolOptions::new()
        .max_connections(200)
        .connect(&db_url)
        .await
        .unwrap_or_else(|_| panic!("missing db {}", db_url))
}
