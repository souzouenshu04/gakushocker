use async_graphql::{InputObject, SimpleObject};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[cfg(test)]
use fake::{faker::name::en::Name, Dummy};

#[derive(FromRow, SimpleObject, Serialize, Deserialize, Debug, PartialEq)]
pub struct User {
    pub id: i32,
    pub display_name: String,
    pub email: String,
    pub password: String,
    pub point: i32,
    pub is_admin: bool,
}

#[cfg_attr(test, derive(Dummy))]
#[derive(InputObject, Deserialize, Clone)]
pub struct UserInput {
    #[cfg_attr(test, dummy(faker = "Name()"))]
    pub display_name: String,
    pub email: String,
    pub password: String,
    pub point: i32,
    pub is_admin: bool,
}
