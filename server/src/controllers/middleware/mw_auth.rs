use crate::controllers::authentication::auth::validate_token;
use axum::headers::authorization::Bearer;
use axum::headers::{Authorization, HeaderMapExt};
use axum::{
    http::{Request, StatusCode},
    middleware::Next,
    response::Response,
};

pub async fn guard<B>(req: Request<B>, next: Next<B>) -> Result<Response, StatusCode> {
    let token = req
        .headers()
        .typed_get::<Authorization<Bearer>>()
        .ok_or(StatusCode::BAD_REQUEST)?
        .token()
        .to_owned();
    if !validate_token(token) {
        return Err(StatusCode::UNAUTHORIZED);
    }
    Ok(next.run(req).await)
}
