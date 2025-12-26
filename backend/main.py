import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from db import Base, engine, get_db
from models import Ticket
from schemas import TicketCreate, TicketOut, TicketUpdate

app = FastAPI(title="TicketDesk API")
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://incidentticket.netlify.app/",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    # In real projects you’d use Alembic migrations.
    Base.metadata.create_all(bind=engine)

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/tickets", response_model=list[TicketOut])
def list_tickets(db: Session = Depends(get_db)):
    return db.query(Ticket).order_by(Ticket.id.desc()).all()

@app.post("/tickets", response_model=TicketOut)
def create_ticket(payload: TicketCreate, db: Session = Depends(get_db)):
    t = Ticket(title=payload.title, description=payload.description, priority=payload.priority)
    db.add(t)
    db.commit()
    db.refresh(t)
    return t

@app.patch("/tickets/{ticket_id}", response_model=TicketOut)
def update_ticket(ticket_id: int, payload: TicketUpdate, db: Session = Depends(get_db)):
    t = db.get(Ticket, ticket_id)
    if not t:
        raise HTTPException(404, "Ticket not found")

    if payload.priority is not None:
        t.priority = payload.priority
    if payload.status is not None:
        t.status = payload.status

    db.commit()
    db.refresh(t)
    return t

@app.delete("/tickets/{ticket_id}")
def delete_ticket(ticket_id: int, db: Session = Depends(get_db)):
    t = db.get(Ticket, ticket_id)
    if not t:
        raise HTTPException(404, "Ticket not found")
    db.delete(t)
    db.commit()
    return {"deleted": True}
