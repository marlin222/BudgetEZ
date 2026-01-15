from sqlalchemy import Column, Integer, String, Float
from db.postgresql import Base

class RecurringExpense(Base):
    __tablename__ = "recurring_expenses"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, index=True)
    amount = Column(Float)
    frequency = Column(String)  # weekly, monthly, yearly
    category = Column(String)
