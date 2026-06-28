from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    MONGODB_URI: str
    MONGODB_DB_NAME: str

    class Config:
        env_file = ".env"


settings = Settings()
