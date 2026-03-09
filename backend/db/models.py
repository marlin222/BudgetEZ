from sqlalchemy import Column, Integer, String, Float, ForeignKey
from db.postgresql import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)

class RecurringExpense(Base):
    __tablename__ = "recurring_expenses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    description = Column(String, index=True)
    amount = Column(Float)
    frequency = Column(String)  # weekly, monthly, yearly
    category = Column(String)
