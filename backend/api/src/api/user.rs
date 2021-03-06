

use actix_web::{web, get, put, post, delete, Scope, HttpResponse, Responder};
use crate::models::user::{test_users, User};
use crate::models::item::{Item, ItemClass};
use crate::SessionData;
use crate::api::{log_api, HttpError};
use bcrypt::{DEFAULT_COST, hash};

static USER_PREFIX:&str = "/user";

pub fn config() -> Scope {
    web::scope(USER_PREFIX)
    .service(all_users)
    .service(create_user)
    .service(delete_user_by_id)
    .service(user_by_id)
    .service(get_user_owned_items)
    .service(get_user_borrowed_items)
    .service(add_borrow_to_user)
    .service(remove_borrow_from_user)
}

pub fn log_user(method:&str, route:&str) {
    log_api(method, &format!("{}{}", USER_PREFIX, route))
}

#[get("")] // all users
async fn all_users(data: web::Data<SessionData>) -> impl Responder {
    log_user("GET", "");
    let db = data.db.clone();

    match db.get_users().await {
        Some(users) => {
            HttpResponse::Ok().json(users)
        }
        None => {
            HttpResponse::Ok().json(test_users())
        }
    }
}

#[post("")]
async fn create_user(data: web::Data<SessionData>, user_json: web::Json<User>) -> impl Responder {
    log_user("POST", "");
    let mut user: User = user_json.into_inner();
    match User::from_db_by_username(&data.db, user.username.clone()).await {
        Some(_) => HttpResponse::BadRequest().json(HttpError {
            status_code: 400,
            message: "username already exists".to_string()
        }),
        None => {
            user.password = hash(user.password, DEFAULT_COST).unwrap();
            user.to_db(&data.db).await;
            HttpResponse::Created().json(User::from_db_by_username(&data.db, user.username).await)
        }
    }
    
} 

#[get("/{id}")]
async fn user_by_id(data: web::Data<SessionData>, id: web::Path<String>) -> impl Responder {
    let id_int = id.into_inner();
    log_user("GET", &format!("/{}", id_int));
    match User::from_db(&data.db, id_int).await {
        Some(user) => {
            HttpResponse::Ok().json(user)
        }
        None => {
            HttpResponse::NotFound().json(HttpError {
                status_code: 404,
                message: "user not found".to_string()
            })
        }
    }
}


#[delete("/{id}")]
async fn delete_user_by_id(data: web::Data<SessionData>, id: web::Path<String>) -> impl Responder {
    let id_int = id.into_inner();
    log_user("DELETE", &format!("/{}", id_int));
    if data.db.delete_kind_by_id("users", &id_int).await {
        HttpResponse::NoContent().finish()
    } else {
        HttpResponse::NotFound().json(HttpError {
            status_code: 404,
            message: "user not found".to_string()
        })
    }
}


#[get("/{id}/owns")]
async fn get_user_owned_items(data: web::Data<SessionData>, id: web::Path<String>) -> impl Responder {
    let id_int = id.into_inner();
    log_user("GET", &format!("/{}/owns", id_int));
    match User::from_db(&data.db, id_int).await {
        Some(user) => match user.get_items(&data.db, ItemClass::Owned).await {
            Some(items) => HttpResponse::Ok().json(items),
            None => HttpResponse::Ok().finish()
        },
        None => HttpResponse::NotFound().json(HttpError {
            status_code: 404,
            message: "user not found".to_string()
        })
    }
}

#[get("/{id}/borrows")]
async fn get_user_borrowed_items(data: web::Data<SessionData>, id: web::Path<String>) -> impl Responder {
    let id_int = id.into_inner();
    log_user("GET", &format!("/{}/borrows", id_int));
    match User::from_db(&data.db, id_int).await {
        Some(user) => match user.get_items(&data.db, ItemClass::Borrowed).await {
            Some(items) => HttpResponse::Ok().json(items),
            None => HttpResponse::Ok().finish()
        },
        None => HttpResponse::NotFound().json(HttpError {
            status_code: 404,
            message: "user not found".to_string()
        })
    }
}

#[put("/{uid}/borrows/{iid}")]
async fn add_borrow_to_user(data: web::Data<SessionData>, ids: web::Path<(String, String)>) -> impl Responder {
    let (uid, iid) = ids.into_inner();
    log_user("PUT", &format!("/{}/borrows/{}", uid, iid));
    match User::from_db(&data.db, uid).await {
        Some(user) => match Item::from_db(&data.db, iid).await {
            Some(mut item) => {
                match (item.id, user.id) {
                    (Some(iid), Some(uid)) => {
                        if user.update_borrow(&data.db, Some(iid)).await {
                            item.update_borrower(Some(uid));
                            HttpResponse::Ok().json(item)
                        } else {
                            HttpResponse::BadRequest().json(HttpError {
                                status_code: 400,
                                message: "unable to complete request".to_string()
                            })
                        }
                    },
                    (_, _) => HttpResponse::BadRequest().json(HttpError {
                        status_code: 400,
                        message: "unable to complete request".to_string()
                    })
                }
                
            },
            None => HttpResponse::NotFound().json(HttpError {
                status_code: 404,
                message: "unable to find item".to_string()
            })
        },
        None => HttpResponse::NotFound().json(HttpError {
            status_code: 404,
            message: "unable to find user".to_string()
        })
    }
}

#[delete("/{uid}/borrows/{iid}")]
async fn remove_borrow_from_user(data: web::Data<SessionData>, ids: web::Path<(String, String)>) -> impl Responder {
    let (uid, iid) = ids.into_inner();
    log_user("DELETE", &format!("/{}/borrows/{}", uid, iid));
    match User::from_db(&data.db, uid).await {
        Some(user) => match user.get_items(&data.db, ItemClass::Borrowed).await {
            Some(items) => {
                match items.iter().find(|i| i.id == Some(iid.parse().unwrap())) {
                    Some(_) => {
                        if user.update_borrow(&data.db, None).await {
                            HttpResponse::NoContent().finish()
                        } else {
                            HttpResponse::BadRequest().json(HttpError {
                                status_code: 400,
                                message: "unable to complete request".to_string()
                            })
                        }
                        
                    }
                    None => HttpResponse::NotFound().json(HttpError {
                        status_code: 404,
                        message: "unable to find item".to_string()
                    })
                }
            },
            None => HttpResponse::NotFound().json(HttpError {
                status_code: 404,
                message: "unable to find item".to_string()
            })
        },
        None => HttpResponse::NotFound().json(HttpError {
            status_code: 404,
            message: "unable to find user".to_string()
        })
    }
}

