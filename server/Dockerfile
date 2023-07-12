#FROM rustlang/rust:nightly-slim as build
FROM rustlang/rust:nightly-slim
WORKDIR /app
RUN apt-get update && apt-get install -y curl libssl-dev pkg-config build-essential
RUN cargo install cargo-watch

COPY ./server/Cargo.toml ./Cargo.toml
COPY ./server/src ./src

EXPOSE 8080

CMD ["cargo", "watch", "-x", "fmt", "-x", "run"]