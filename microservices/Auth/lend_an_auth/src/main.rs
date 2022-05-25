mod config;

use color_eyre::Result;
use actix_web::{App, HttpServer, middleware::Logger};
use tracing::info;

use crate::config::Config;



#[actix_rt::main]
async fn main() -> Result<()>{
    
	let config = Config::from_env()
		.expect("Server Configuration");
	
	info!("Starting server at http://{}:{}",config.host,config.port);

	HttpServer::new(move || {
		App::new()
			.wrap(Logger::default())
	})
	.bind(format!("{}:{}",config.host, config.port))?
	.run()
	.await?;

	Ok(())
}