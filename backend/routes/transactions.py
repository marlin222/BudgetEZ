from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from schemas import Transaction, TransactionCreate
from db.mongodb import get_transactions_collection
from auth import get_current_user
from db.models import User

router = APIRouter(prefix="/transactions", tags=["transactions"])

@router.get("/", response_model=list[Transaction])
async def get_transactions(current_user: User = Depends(get_current_user)):
    collection = get_transactions_collection()
    transactions = []
    cursor = collection.find({"user_id": current_user.id}).sort("date", -1)
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        transactions.append(Transaction(**doc))
    return transactions

@router.post("/", response_model=Transaction)
async def create_transaction(transaction: TransactionCreate, current_user: User = Depends(get_current_user)):
    collection = get_transactions_collection()
    transaction_dict = transaction.model_dump()
    transaction_dict["user_id"] = current_user.id
    result = await collection.insert_one(transaction_dict)
    transaction_dict["_id"] = str(result.inserted_id)
    return Transaction(**transaction_dict)

@router.delete("/{transaction_id}")
async def delete_transaction(transaction_id: str, current_user: User = Depends(get_current_user)):
    collection = get_transactions_collection()
    try:
        result = await collection.delete_one({"_id": ObjectId(transaction_id), "user_id": current_user.id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Transaction not found")
        return {"message": "Transaction deleted"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
