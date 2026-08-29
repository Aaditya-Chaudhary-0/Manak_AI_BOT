import logging
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables and .env file.
    """
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    # --- Database ---
    DATABASE_URL: str = "postgresql+asyncpg://manakai:manakai@localhost:5432/manakai"

    # --- Vector DB ---
    QDRANT_URL: str = "http://localhost:6333"
    QDRANT_COLLECTION: str = "bis_chunks"

    # --- Auth ---
    JWT_SECRET: str = "change-this-to-a-long-random-string"
    JWT_EXPIRY_MINUTES: int = 60

    # --- Embeddings ---
    EMBEDDING_MODEL: str = "BAAI/bge-m3"

    # --- Agentverse (optional) ---
    AGENTVERSE_API_KEY: Optional[str] = None

    # --- App ---
    ENV: str = "development"
    LOG_LEVEL: str = "info"

    # --- Retrieval thresholds ---
    RETRIEVAL_ABSTAIN_THRESHOLD: float = 0.40
    RETRIEVAL_HIGH_THRESHOLD: float = 0.75
    RETRIEVAL_MEDIUM_THRESHOLD: float = 0.55


settings = Settings()


def setup_logging() -> None:
    """
    Configures application-wide logging format and level.
    """
    log_level_map = {
        "debug": logging.DEBUG,
        "info": logging.INFO,
        "warning": logging.WARNING,
        "error": logging.ERROR,
        "critical": logging.CRITICAL,
    }
    
    level = log_level_map.get(settings.LOG_LEVEL.lower(), logging.INFO)
    
    logging.basicConfig(
        level=level,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
