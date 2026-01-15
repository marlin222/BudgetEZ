from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from datetime import datetime
from schemas import Transaction, TransactionCreate
from db.mongodb import get_transactions_collection

router = APIRouter(prefix="/transactions", tags=["transactions"])

@router.get("/", response_model=list[Transaction])
async def get_transactions():
    """Get all transactions"""
    collection = get_transactions_collection()
    transactions = []
    async for doc in collection.find().sort("date", -1):
        doc["_id"] = str(doc["_id"])
        transactions.append(Transaction(**doc))
    return transactions

@router.post("/", response_model=Transaction)
async def create_transaction(transaction: TransactionCreate):
    """Create a new transaction"""
    collection = get_transactions_collection()
    transaction_dict = transaction.model_dump()
    result = await collection.insert_one(transaction_dict)
    transaction_dict["_id"] = str(result.inserted_id)
    return Transaction(**transaction_dict)

@router.get("/{transaction_id}", response_model=Transaction)
async def get_transaction(transaction_id: str):
    """Get a specific transaction"""
    collection = get_transactions_collection()
    try:
        doc = await collection.find_one({"_id": ObjectId(transaction_id)})
        if not doc:
            raise HTTPException(status_code=404, detail="Transaction not found")
        doc["_id"] = str(doc["_id"])
        return Transaction(**doc)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{transaction_id}")
async def delete_transaction(transaction_id: str):
    """Delete a transaction"""
    collection = get_transactions_collection()
    try:
        result = await collection.delete_one({"_id": ObjectId(transaction_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Transaction not found")
        return {"message": "Transaction deleted"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
