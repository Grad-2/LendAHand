use color_eyre::Result;
use eyre::WrapErr;
use serde::Deserialize;
use dotenv::dotenv;
use tracing::{info, instrument};
use tracing_subscriber::EnvFilter;



#[derive(Debug, Deserialize)]
pub struct Config {
	pub host: String,
	pub port: i32
}

impl Config {

	#[instrument]
	pub fn from_env() -> Result<Config> {
		dotenv().ok();

		tracing_subscriber::fmt()
			.with_env_filter(EnvFilter::from_default_env())
			.init();

		info!("Loading configuration.");

		let mut cfg = config::Config::new();

		cfg.merge(config::Environment::default())?;

		cfg.try_into()
			.context("Loading configuration from environment")
	}
}