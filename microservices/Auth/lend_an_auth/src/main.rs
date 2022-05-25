mod config;

use color_eyre::Result;
use actix_web::{App, HttpServer};

use crate::config::Config;



#[actix_rt::main]
async fn main() -> Result<()>{
    
	let config = Config::from_env()
		.expect("LaAuth: Server Configuration");

	HttpServer::new(move ||{
		App::new()
	})
	.bind(format!("{}:{}",config.host, config.port))?
	.run()
	.await?;

	Ok(())
}