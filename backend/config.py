import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
MONGODB_DB = os.getenv("MONGODB_DB", "budgetez")

# PostgreSQL
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://budgetez:budgetez@localhost:5432/budgetez")

# FastAPI
DEBUG = os.getenv("DEBUG", "True").lower() == "true"
