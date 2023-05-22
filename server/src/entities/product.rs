use async_graphql::{InputObject, SimpleObject};
use sqlx::FromRow;

#[cfg(test)]
use fake::Dummy;

#[cfg_attr(test, derive(Dummy))]
#[derive(FromRow, Clone, SimpleObject, PartialEq, Debug)]
pub struct Product {
    pub id: i32,
    pub name: String,
    pub price: i32,
    pub stock: i32,
}

#[cfg_attr(test, derive(Dummy))]
#[derive(InputObject, Debug, Clone)]
pub struct ProductInput {
    pub name: String,
    pub price: i32,
    pub stock: i32,
}
