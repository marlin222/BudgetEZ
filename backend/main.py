from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.postgresql import Base, engine
from routes.transactions import router as transactions_router
from routes.recurring import router as recurring_router

# Create tables in PostgreSQL
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BudgetEZ API", version="0.1.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(transactions_router)
app.include_router(recurring_router)

@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
