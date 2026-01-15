import motor.motor_asyncio
from config import MONGODB_URL, MONGODB_DB

# MongoDB setup
client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL)
db = client[MONGODB_DB]

async def get_mongodb():
    return db

def get_transactions_collection():
    return db.transactions
