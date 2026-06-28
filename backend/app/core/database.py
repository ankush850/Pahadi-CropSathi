from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

client: AsyncIOMotorClient | None = None


async def connect_to_mongo():
    global client
    client = AsyncIOMotorClient(settings.MONGODB_URI)


async def close_mongo_connection():
    if client:
        client.close()


def get_database():
    return client[settings.MONGODB_DB_NAME]
