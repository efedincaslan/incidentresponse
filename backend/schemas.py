from pydantic import BaseModel, Field
from typing import Literal
from datetime import datetime

Priority = Literal["low", "med", "high"]
Status = Literal["open", "in_progress", "closed"]

class TicketCreate(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    description: str = Field(min_length=1, max_length=1000)
    priority: Priority = "med"

class TicketUpdate(BaseModel):
    priority: Priority | None = None
    status: Status | None = None

class TicketOut(BaseModel):
    id: int
    title: str
    description: str
    priority: Priority
    status: Status
    created_at: datetime

    model_config = {"from_attributes": True}
