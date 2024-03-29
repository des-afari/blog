from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DB_DRIVERNAME: str
    DB_USERNAME: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: int
    DB_DATABASE: str

    ACCESS_KEY: str
    REFRESH_KEY: str

    ACCESS_EXPIRY: int
    REFRESH_EXPIRY: int

    class Config:
        env_file = '.env'

settings = Settings()