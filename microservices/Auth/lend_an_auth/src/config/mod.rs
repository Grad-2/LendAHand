use color_eyre::Result;
use eyre::WrapErr;
use serde::Deserialize;
use dotenv::dotenv;




#[derive(Debug, Deserialize)]
pub struct Config {
	pub host: String,
	pub port: i32
}

impl Config {
	pub fn from_env() -> Result<Config> {
		dotenv().ok();

		let mut cfg = config::Config::new();

		cfg.merge(config::Environment::default())?;

		cfg.try_into()
			.context("LaAuth: loading configuration from environment")
	}
}