use crate::constants;
use crate::constants::DEFAULT_POINT;
use crate::database;
use crate::database::RepositoryProvider;
use crate::entities::user::UserInput;
use crate::usecases::user;
use axum::routing::post;
use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    {extract::Json, Router},
};
use chrono::Utc;
use jsonwebtoken::{decode, encode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use once_cell::sync::Lazy;
use serde::{Deserialize, Serialize};
use serde_json::json;

#[derive(Deserialize)]
struct SignedUser {
    email: String,
    password: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct AuthedBody {
    id: i32,
    display_name: String,
    email: String,
    point: i32,
    token: String,
    is_admin: bool,
}

#[derive(Debug)]
pub enum AuthError {
    WrongCredentials,
    MissingCredentials,
    TokenCreation,
    InvalidToken,
}

impl IntoResponse for AuthError {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            AuthError::WrongCredentials => (StatusCode::UNAUTHORIZED, "Wrong credentials"),
            AuthError::MissingCredentials => (StatusCode::BAD_REQUEST, "Missing credentials"),
            AuthError::TokenCreation => (StatusCode::INTERNAL_SERVER_ERROR, "Token creation error"),
            AuthError::InvalidToken => (StatusCode::BAD_REQUEST, "Invalid token"),
        };
        let body = Json(json!({
            "error": error_message,
        }));
        (status, body).into_response()
    }
}

#[derive(Serialize, Deserialize)]
struct Claims {
    sub: String,
    exp: i64,
    email: String,
}

impl Claims {
    fn new(email: String) -> Self {
        let timestamp = Utc::now().timestamp();
        Claims {
            sub: "token".to_string(),
            exp: timestamp + (3600 * 4),
            email,
        }
    }
}

static KEYS: Lazy<Keys> = Lazy::new(|| {
    let secret = constants::secret_key();
    Keys::new(secret.as_bytes())
});

struct Keys {
    encoding: EncodingKey,
    decoding: DecodingKey,
}

impl Keys {
    fn new(secret: &[u8]) -> Self {
        Self {
            encoding: EncodingKey::from_secret(secret),
            decoding: DecodingKey::from_secret(secret),
        }
    }
}

pub fn auth_router() -> Router {
    Router::new()
        .route("/signin", post(sign_in))
        .route("/signup", post(sign_up))
}

async fn sign_in(Json(payload): Json<SignedUser>) -> Result<Json<AuthedBody>, AuthError> {
    if payload.email.is_empty() || payload.password.is_empty() {
        return Err(AuthError::MissingCredentials);
    }
    let pool = database::db_pool().await;
    let repo = RepositoryProvider(pool.into());
    let found_user = match user::find_user_by_email(&repo, payload.email.clone()).await {
        Ok(user) => user,
        Err(_) => return Err(AuthError::WrongCredentials),
    };
    let authorized_user = match found_user {
        Some(user) => {
            if user.password != payload.password {
                return Err(AuthError::InvalidToken);
            }
            user
        }
        None => return Err(AuthError::WrongCredentials),
    };
    let claims = Claims::new(payload.email);
    let token = encode(&Header::default(), &claims, &KEYS.encoding)
        .map_err(|_| AuthError::TokenCreation)
        .expect("missed encoding claims");
    Ok(Json(AuthedBody {
        id: authorized_user.id,
        display_name: authorized_user.display_name,
        email: authorized_user.email,
        point: authorized_user.point,
        token,
        is_admin: authorized_user.is_admin,
    }))
}

async fn sign_up(Json(payload): Json<UserInput>) -> Result<Json<AuthedBody>, AuthError> {
    if payload.email.is_empty() || payload.password.is_empty() {
        return Err(AuthError::MissingCredentials);
    }
    let pool = database::db_pool().await;
    let repo = RepositoryProvider(pool.into());
    let user = match user::save(&repo, payload).await {
        Ok(user) => user,
        Err(_) => return Err(AuthError::WrongCredentials),
    };
    let claims = Claims::new(user.email.clone());
    let token = encode(&Header::default(), &claims, &KEYS.encoding)
        .map_err(|_| AuthError::TokenCreation)
        .expect("missed encoding claims");
    Ok(Json(AuthedBody {
        id: user.id,
        display_name: user.display_name,
        email: user.email,
        point: DEFAULT_POINT,
        token,
        is_admin: user.is_admin,
    }))
}

pub fn validate_token(token: String) -> bool {
    match decode::<Claims>(&token, &KEYS.decoding, &Validation::new(Algorithm::HS256)) {
        Ok(_claims) => true,
        Err(_) => false,
    }
}
