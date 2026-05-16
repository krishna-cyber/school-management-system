# 🏫 School Management System

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)

---

## 🚧 Under Development

> **Status:** Active Development | **Type:** Portfolio / Skill Demonstration  
> *Not yet production-ready — shared to showcase architecture decisions, code quality, and technical depth.*

---

## 📖 Project Description

A full-stack school management system built with **NestJS** (backend) and **Next.js** (dashboard).  
Designed as an MVP to demonstrate modern backend patterns, queue-based job processing, and a clean frontend architecture.

---

## 📁 Project Structure

school-management-system/<br>
├── api/ # Bruno API collection (manual testing) <br>
├── backend/ # NestJS API (Node.js)<br>
└── dashboard/ # Next.js 14 frontend


### Backend Technology Stack

| Technology | Purpose |
|------------|---------|
| **NestJS** | Backend framework (modular architecture) |
| **MongoDB** | NoSQL database (flexible schema for school data) |
| **BullMQ** | Redis-based job queue (background tasks) |
| **BetterAuth** | Authentication & authorization layer |

### Frontend Technology Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework (App Router) |
| **Shadcn/ui** | Component library (accessible, themed) |
| **React Query** | Server-state management & caching |
| **BetterAuth** | Client-side auth integration |

---

## 🔧 Environment Variables

### Backend (`/backend/.env`)

```env
PORT=

# Database
DATABASE_CONNECTION_STRING=

# Redis (BullMQ)
REDIS_HOST=
REDIS_PORT=

# Authentication (BetterAuth)
BETTER_AUTH_JWT_SECRET=
BETTER_AUTH_BASE_URL=

# Observability (OpenTelemetry)
OTEL_SERVICE_NAME=
OTEL_EXPORTER_OTLP_ENDPOINT=

# Cross-service
NEXT_JS_DASHBOARD_URL=
```

### Backend (`/dashboard/.env.local`)

```env
#Nestjs backend url
NEXT_PUBLIC_API_URL=
```
## 🚀 Running the Backend

```bash
cd backend

npm install

npm run start:dev
```

## 💻 Running the Frontend

```bash
cd dashboard

npm install

npm run