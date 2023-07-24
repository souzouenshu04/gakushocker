FROM rustlang/rust:nightly-slim as build
WORKDIR /app
RUN apt-get update && apt-get install -y curl libssl-dev pkg-config build-essential

COPY ./server/Cargo.toml ./Cargo.toml
COPY ./server/src ./src

EXPOSE 8080

CMD ["cargo", "run"]
