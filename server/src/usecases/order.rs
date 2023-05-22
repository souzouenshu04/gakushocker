use crate::database::RepositoryProvider;
use crate::entities::product::ProductInput;
use crate::entities::{
    order::{Order, OrderInput},
    user::UserInput,
};
use crate::services::order as OrderServices;
use crate::services::product as ProductServices;
use crate::services::user as UserServices;
use anyhow::Result;
use sqlx::Error;
use uuid::Uuid;

pub async fn create(repo: &RepositoryProvider, input: OrderInput) -> Result<Order> {
    let found_user = match UserServices::find_by_id(repo.users(), input.user_id).await? {
        Some(u) => u,
        None => return Err(Error::RowNotFound.into()),
    };
    let updated_user = UserInput {
        display_name: found_user.display_name,
        email: found_user.email,
        password: found_user.password,
        point: found_user.point - input.total,
        is_admin: found_user.is_admin,
    };
    UserServices::save(repo.users(), updated_user).await?;
    let saved_order = OrderServices::save(repo.orders(), input.clone()).await?;
    let order_items = input.items.iter().map(|item| async move {
        if let Some(saved_item) = ProductServices::find_by_id(repo.products(), item.product_id)
            .await
            .unwrap()
        {
            Ok(ProductInput {
                name: saved_item.name,
                price: saved_item.price,
                stock: saved_item.stock - item.quantity,
            })
        } else {
            Err(Error::RowNotFound)
        }
    });
    for p in order_items {
        ProductServices::save(repo.products(), p.await.unwrap()).await?;
    }
    Ok(saved_order)
}

pub async fn delete(repo: &RepositoryProvider, id: Uuid) -> Result<Order> {
    OrderServices::delete(repo.orders(), id).await
}

pub async fn find_order_by_id(repo: &RepositoryProvider, id: Uuid) -> Result<Option<Order>> {
    OrderServices::find_by_id(repo.orders(), id).await
}

pub async fn list_order(repo: &RepositoryProvider) -> Result<Vec<Order>> {
    OrderServices::list(repo.orders()).await
}

#[cfg(test)]
mod tests {
    use crate::database::{db_pool, RepositoryProvider};
    use crate::entities::order::{Order, OrderInput, OrderItem, OrderItemInput};
    use crate::services::order as OrderService;
    use crate::usecases::order;
    use anyhow::Result;
    use fake::{Fake, Faker};
    use sqlx::Error;
    use uuid::Uuid;

    #[tokio::test]
    async fn test_order_usecases_create_and_delete() -> Result<()> {
        let pool = db_pool().await;
        let tx = pool.begin().await?;
        let repo = RepositoryProvider(pool.into());
        let input = OrderInput {
            id: Faker.fake::<Uuid>(),
            user_id: 1,
            total: 360,
            items: vec![OrderItemInput {
                product_id: 4,
                quantity: 1,
            }],
        };
        let created_order = order::create(&repo, input.clone()).await?;
        let expected_order = Order {
            id: input.id.clone(),
            user_id: input.user_id,
            items: vec![OrderItem {
                name: "カツ丼".to_string(),
                price: 360,
                quantity: 1,
            }],
            total: 360,
            created_at: created_order.created_at.clone(),
        };
        assert_eq!(expected_order.clone(), created_order);

        let expected_order = Order {
            items: vec![],
            ..expected_order
        };
        let deleted_order = order::delete(&repo, input.id).await?;
        assert_eq!(expected_order, deleted_order);

        tx.rollback().await?;
        Ok(())
    }

    #[tokio::test]
    async fn test_order_usecases_find_order_by_id_and_list() -> Result<()> {
        let pool = db_pool().await;
        let tx = pool.begin().await?;
        let repo = RepositoryProvider(pool.into());
        let input = OrderInput {
            id: Faker.fake::<Uuid>(),
            user_id: 1,
            total: 360,
            items: vec![OrderItemInput {
                product_id: 4,
                quantity: 1,
            }],
        };
        let id = input.id.clone();
        OrderService::save(repo.orders(), input.clone()).await?;
        let found_order = order::find_order_by_id(&repo, id).await?;
        assert!(found_order.is_some());

        let order = match found_order {
            Some(o) => o,
            None => return Err(Error::RowNotFound.into()),
        };
        let order_list = order::list_order(&repo).await?;
        assert!(order_list.contains(&order));
        tx.rollback().await?;
        Ok(())
    }
}
