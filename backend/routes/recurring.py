from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from schemas import RecurringExpense, RecurringExpenseCreate
from db.postgresql import get_db
from db.models import RecurringExpense as RecurringExpenseModel, User
from auth import get_current_user

router = APIRouter(prefix="/recurring", tags=["recurring"])

@router.get("/", response_model=list[RecurringExpense])
async def get_recurring(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(RecurringExpenseModel).filter(RecurringExpenseModel.user_id == current_user.id).all()

@router.post("/", response_model=RecurringExpense)
async def create_recurring(expense: RecurringExpenseCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_expense = RecurringExpenseModel(**expense.model_dump(), user_id=current_user.id)
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@router.delete("/{expense_id}")
async def delete_recurring(expense_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    expense = db.query(RecurringExpenseModel).filter(
        RecurringExpenseModel.id == expense_id,
        RecurringExpenseModel.user_id == current_user.id
    ).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Recurring expense not found")
    db.delete(expense)
    db.commit()
    return {"message": "Recurring expense deleted"}
