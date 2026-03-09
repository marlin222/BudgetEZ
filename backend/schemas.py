from datetime import datetime
from pydantic import BaseModel, Field, field_validator
from typing import Optional
import re

# Auth Models
class UserLogin(BaseModel):
    username: str
    password: str

class UserCreate(UserLogin):
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) <= 8:
            raise ValueError('Password must be longer than 8 characters')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>\[\]_\-+=\\;\'`~/]', v):
            raise ValueError('Password must contain at least one special character')
        return v

class Token(BaseModel):
    access_token: str
    token_type: str

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
