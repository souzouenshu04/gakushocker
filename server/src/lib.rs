extern crate core;

mod database;

mod entities {
    pub mod order;
    pub mod product;
    pub mod user;
}

pub mod controllers {
    pub mod router;
}

mod presenters {
    pub mod mutation;
    pub mod query;
}

mod repositories {
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
    use dotenvy::dotenv;
    pub fn db_url() -> String {
        dotenv().ok();
        std::env::var("DATABASE_URL").expect("Missing DATABASE_URL")
    }
}
