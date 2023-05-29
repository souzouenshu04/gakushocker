use axum::{
    extract::Json,
    http::StatusCode,
    response::{IntoResponse, Response},
};
use serde_json::json;

#[derive(Debug)]
pub enum Error {
    NotFound,
    ValidationFailed,
    UnAuthorized,
}

impl IntoResponse for Error {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            Error::NotFound => (StatusCode::NOT_FOUND, "Not Found"),
            Error::ValidationFailed => (StatusCode::BAD_REQUEST, "Invalid Parameter"),
            Error::UnAuthorized => (StatusCode::UNAUTHORIZED, "Un Authorized"),
        };
        let body = Json(json!({ "error": error_message }));
        (status, body).into_response()
    }
}
