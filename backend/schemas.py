from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional

# Transaction Models
class TransactionBase(BaseModel):
    description: str
    amount: float
    type: str  # "income" or "expense"
    category: str
    date: datetime

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: Optional[str] = Field(None, alias="_id")

    class Config:
        populate_by_name = True

# Recurring Expense Models
class RecurringExpenseBase(BaseModel):
    description: str
    amount: float
    frequency: str  # "weekly", "monthly", "yearly"
    category: str

class RecurringExpenseCreate(RecurringExpenseBase):
    pass

class RecurringExpense(RecurringExpenseBase):
    id: Optional[int] = None

    class Config:
        from_attributes = True
