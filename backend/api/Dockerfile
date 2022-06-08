FROM rust:latest

WORKDIR /api

# RUN --mount-type=secret,id=POSTGRES_PORT \
#     --mount-type=secret,id=BACKEND_PORT \
#     export POSTGRES_PORT=$(cat /run/secrets/POSTGRES_PORT) && \
#     export BACKEND_PORT=$(cat /run/secrets/BACKEND_PORT) && \
#     echo "fn main() {}" > dummy.rs
RUN echo "fn main() {}" > dummy.rs

COPY ./Cargo.toml ./Cargo.toml

RUN sed -i 's#src/main.rs#dummy.rs#' Cargo.toml

RUN cargo build --release

RUN sed -i 's#dummy.rs#src/main.rs#' Cargo.toml

COPY ./src ./src
COPY ./migrations ./migrations

RUN cargo build --release

CMD ["target/release/api"]