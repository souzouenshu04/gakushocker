mod database;
mod error;

mod entities {
    pub mod order;
    pub mod product;
    pub mod user;
}

pub mod controllers {
    pub mod router;
    pub mod websocket;
    pub mod presenters {
        pub mod mutation;
        pub mod query;
    }
    mod authentication {
        pub mod auth;
    }
    mod middleware {
        pub mod mw_auth;
    }
}

mod repositories {
    pub mod order;
    pub mod product;
    pub mod user;
}

mod repository_impl {
    pub mod order;
    pub mod product;
    pub mod user;
}

mod services {
    pub mod order;
    pub mod product;
    pub mod user;
}

mod usecases {
    pub mod order;
    pub mod product;
    pub mod user;
}

pub mod constants {
    pub const DEFAULT_POINT: i32 = 0;

    use dotenvy::dotenv;
    pub fn db_url() -> String {
        dotenv().ok();
        std::env::var("DATABASE_URL").expect("Missing DATABASE_URL")
    }
    pub fn secret_key() -> String {
        dotenv().ok();
        std::env::var("SECRET").expect("Missing SECRET")
    }
}
