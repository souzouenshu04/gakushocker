use crate::controllers::authentication::auth::auth_router;
use crate::controllers::middleware::mw_auth;
use crate::controllers::presenters::mutation::Mutation;
use crate::controllers::presenters::query::Query;
use crate::database;
use crate::database::RepositoryProvider;
use async_graphql::{http::GraphiQLSource, EmptySubscription, Request, Response, Schema};
use axum::{
    extract::State,
    http::StatusCode,
    middleware::from_fn,
    response::{Html, IntoResponse},
    routing::get,
    Json, Router,
};
use std::sync::Arc;
use tower_http::cors::CorsLayer;

type GakushockerSchema = Schema<Query, Mutation, EmptySubscription>;

pub async fn root() -> Router {
    let cors = cors();

    let pool = database::db_pool().await;
    let repository_provider = RepositoryProvider(Arc::new(pool));
    let schema = Schema::build(Query, Mutation, EmptySubscription)
        .data(repository_provider)
        .finish();

    Router::new()
        .route("/", get(graphql).post(graphql_handler))
        .layer(from_fn(mw_auth::guard))
        .with_state(schema)
        .nest("/auth", auth_router())
        .layer(cors)
}

async fn graphql_handler(
    schema: State<GakushockerSchema>,
    req: Json<Request>,
) -> Result<Json<Response>, StatusCode> {
    Ok(schema.execute(req.0).await.into())
}

async fn graphql() -> impl IntoResponse {
    Html(
        GraphiQLSource::build()
            .endpoint("http://localhost:8080")
            .finish(),
    )
}

fn cors() -> CorsLayer {
    CorsLayer::very_permissive()
}
