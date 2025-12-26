TicketDesk — Incident Ticketing Platform

TicketDesk is a lightweight, full-stack incident ticketing system inspired by enterprise ITSM tools. The goal of this project was to recreate the core workflow of an incident management system—ticket creation, prioritization, status updates, and resolution—using modern cloud-native tooling.

During my time at Fidelity, I worked extensively with ServiceNow’s incident ticketing system to track operational issues, security events, and workflow escalations. This project was a way to internalize how those systems work under the hood by building a simplified version from scratch.

Why This Project Exists

Enterprise platforms like ServiceNow are powerful, but abstract away a lot of the underlying architecture. This project focuses on:

Understanding how incident tickets are modeled and stored

Designing a REST API that mirrors real ITSM workflows

Handling cross-origin frontend ↔ backend communication

Deploying a production-ready stack with real infrastructure

TicketDesk is intentionally minimal—but structurally realistic.

Core Features

Create incident tickets with title, description, and priority

Track ticket status (open, in_progress, closed)

Update or delete tickets dynamically

Persistent storage using a managed cloud database

Deployed backend API + static frontend

Tech Stack Overview
Backend

FastAPI — REST API framework

SQLAlchemy — ORM for data modeling

PostgreSQL (Neon) — serverless managed database

psycopg — PostgreSQL driver

Uvicorn — ASGI server

Render — backend hosting

Frontend

Vanilla HTML / CSS / JavaScript

Static deployment via Netlify

Fetch-based API communication

No frontend framework to keep logic explicit and transparent

Architecture
Browser (Netlify)
   ↓ HTTPS (fetch)
FastAPI Backend (Render)
   ↓ SQLAlchemy
PostgreSQL Database (Neon)


The frontend is a static site hosted on Netlify

The backend is a FastAPI service hosted on Render

The backend connects securely to a Neon-hosted PostgreSQL database

CORS is explicitly configured to allow frontend → backend communication

Database (Neon)

PostgreSQL database hosted on Neon

Connection managed via DATABASE_URL

SSL enforced for production connections

Schema defined via SQLAlchemy models

Neon was chosen for its serverless model, reliability, and ease of integration with cloud deployments.
