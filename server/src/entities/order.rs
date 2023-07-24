use std::fmt::{Display, Formatter};
use async_graphql::{InputObject, SimpleObject};
use chrono::NaiveDateTime;
use sqlx::postgres::{PgHasArrayType, PgTypeInfo};
use sqlx::{FromRow, Type};
use uuid::Uuid;

#[cfg(test)]
use fake::Dummy;
use serde::{Deserialize, Serialize};

#[cfg_attr(test, derive(Dummy))]
#[derive(FromRow, Clone, SimpleObject, Debug, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Order {
    pub id: Uuid,
    pub user_id: i32,
    pub items: Vec<OrderItem>,
    pub total: i32,
    pub created_at: NaiveDateTime,
}

#[cfg_attr(test, derive(Dummy))]
#[derive(FromRow, Clone, SimpleObject, Type, Debug, PartialEq, Serialize, Deserialize)]
pub struct OrderItem {
    pub name: String,
    pub price: i32,
    pub quantity: i32,
}

impl PgHasArrayType for OrderItem {
    fn array_type_info() -> PgTypeInfo {
        PgTypeInfo::with_name("_items")
    }

    fn array_compatible(_ty: &PgTypeInfo) -> bool {
        true
    }
}

#[cfg_attr(test, derive(Dummy))]
#[derive(InputObject, Debug, Clone)]
pub struct OrderInput {
    pub id: Uuid,
    #[cfg_attr(test, dummy(faker = "1"))]
    pub user_id: i32,
    pub total: i32,
    pub items: Vec<OrderItemInput>,
    pub is_use_point: bool,
}

#[cfg_attr(test, derive(Dummy))]
#[derive(FromRow, InputObject, Debug, Clone)]
pub struct OrderItemInput {
    #[cfg_attr(test, dummy(faker = "1"))]
    pub product_id: i32,
    #[cfg_attr(test, dummy(faker = "1..100"))]
    pub quantity: i32,
}

#[derive(FromRow)]
pub struct OrderWithoutItems {
    pub id: Uuid,
    pub user_id: i32,
    pub total: i32,
    pub created_at: NaiveDateTime,
}
