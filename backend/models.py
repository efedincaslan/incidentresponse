from sqlalchemy import String, Integer, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from db import Base

class Ticket(Base):
    __tablename__ = "tickets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(String(1000), nullable=False)
    priority: Mapped[str] = mapped_column(String(10), nullable=False, default="med")  # low/med/high
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="open")   # open/in_progress/closed
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())
