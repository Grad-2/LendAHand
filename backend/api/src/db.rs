use sqlx::postgres::{PgPoolOptions, PgPool};
use crate::models::user::{User, test_users};
use crate::models::item::{Item, test_items};
use dotenv;

#[derive(Clone)]
pub struct Db {
    pub host: String,
    pub db_name: String,
    pub pool: Option<PgPool>
}

impl Db {
    pub async fn new(un:String, pw:String, h:String, db:String) -> Self {
        Self {
            host: h.clone(),
            db_name: db.clone(),
            pool: Db::pool(un, pw, h, db).await
        }
    }

    pub async fn from_env() -> Self {
        dotenv::dotenv().ok();
        let username = dotenv::var("POSTGRES_USER");
        let password = dotenv::var("POSTGRES_PASSWORD");
        let host = dotenv::var("HOST");
        let db_name = dotenv::var("POSTGRES_DB");

        match (username, password, host, db_name) {
            (Ok(un), Ok(pw), Ok(h), Ok(db)) => {
                Db::new(un, pw, h, db).await
            }
            (_, _, _, _) => {
                warn!("Postgres DB environment variables not set. Defaulting to localhost/postgres");
                Db::new("postgres".to_string(),
                        "postgres".to_string(),
                        "0.0.0.0".to_string(),
                        "postgres".to_string()).await
            }
        }
    }

    pub async fn pool(username:String, password:String, host:String, db:String) -> Option<PgPool> {
        info!("postgres://{}:{}@{}", username, password, db);
        let pgpool = PgPoolOptions::new()
            .max_connections(5)
            .connect(format!("postgres://{}:{}@{}", username, password, db).as_str())
            .await;

        match pgpool {
            Ok(pool) => {
                info!("Connected to Postgres DB {}/{}", host, db);
                Some(pool)
            }
            Err(err) => {
                warn!("Database connection error: {}", err);
                None
            }
        }
    }

    pub async fn delete_kind_by_id(&self, kind:&str, id:&str) -> bool {
        match &self.pool {
            Some(pool) => {
                match sqlx::query(&format!("DELETE FROM {} WHERE id = {};", kind, id))
                .execute(&*pool)
                .await {
                    Ok(_) => {
                        info!("Deleted {}.", kind);
                        true
                    },
                    Err(e) => {
                        warn!("Delete error: {}", e);
                        false
                    }
                }
            }
            None => {
                warn!("No database connections exist.");
                false
            }
        }
    }

    pub async fn get_users(self) -> Option<Vec<User>> {
        match self.pool {
            Some(pool) => {
                match sqlx::query_as::<_, User>("SELECT * FROM users").fetch_all(&pool).await {
                    Ok(rows) => Some(rows),
                    Err(err) => {
                        warn!("Database query error: {}", err);
                        None
                    }
                }
            }
            None => {
                warn!("No database connections exist.");
                None
            }
        }
    }

    pub async fn get_items(&self) -> Option<Vec<Item>> {
        match &self.pool {
            Some(pool) => {
                match sqlx::query_as::<_, Item>("SELECT * FROM items i JOIN user_items ui ON ui.item_id = i.id").fetch_all(&*pool).await {
                    Ok(rows) => Some(rows),
                    Err(err) => {
                        warn!("Database query error: {}", err);
                        None
                    }
                }
            }
            None => {
                warn!("No database connections exist.");
                None
            }
        }
    }

    pub async fn migrate(&self) {
        match &self.pool {
            Some(pool) => {
                match sqlx::migrate!().run(&*pool).await {
                    Ok(_) => info!("Database migration complete"),
                    Err(e) => warn!("Database migration error. {}", e)
                }
            }
            None => warn!("No database connections exist")
        }
    }

    pub async fn seed_data(&self) {
        match self.clone().get_users().await {
            Some(db_users) => {
                if db_users.len() == 0 {
                    let users = test_users();
                    for user in &users {
                        user.to_db(&self).await;
                    }
                    let user1 = User::from_db_by_username(&self, users[0].username.clone()).await;
                    let user2 = User::from_db_by_username(&self, users[1].username.clone()).await;
                    match (user1, user2) {
                        (Some(u1), Some(u2)) => {
                            match (u1.id, u2.id) {
                                (Some(id1), Some(id2)) => {
                                    let items = test_items(id1, id2);
                                    for item in items {
                                        item.to_db(&self).await;
                                    }
                                },
                                (_, _) => {}
                            }

                        },
                        (_, _) => {}
                    }

                }
            },
            None => {}
        }
    }
}
