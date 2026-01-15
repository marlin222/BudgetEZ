from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from schemas import RecurringExpense, RecurringExpenseCreate
from db.postgresql import get_db
from db.models import RecurringExpense as RecurringExpenseModel

router = APIRouter(prefix="/recurring", tags=["recurring"])

@router.get("/", response_model=list[RecurringExpense])
async def get_recurring(db: Session = Depends(get_db)):
    """Get all recurring expenses"""
    return db.query(RecurringExpenseModel).all()

@router.post("/", response_model=RecurringExpense)
async def create_recurring(expense: RecurringExpenseCreate, db: Session = Depends(get_db)):
    """Create a new recurring expense"""
    db_expense = RecurringExpenseModel(**expense.model_dump())
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@router.get("/{expense_id}", response_model=RecurringExpense)
async def get_recurring_item(expense_id: int, db: Session = Depends(get_db)):
    """Get a specific recurring expense"""
    expense = db.query(RecurringExpenseModel).filter(RecurringExpenseModel.id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Recurring expense not found")
    return expense

@router.delete("/{expense_id}")
async def delete_recurring(expense_id: int, db: Session = Depends(get_db)):
    """Delete a recurring expense"""
    expense = db.query(RecurringExpenseModel).filter(RecurringExpenseModel.id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Recurring expense not found")
    db.delete(expense)
    db.commit()
    return {"message": "Recurring expense deleted"}
