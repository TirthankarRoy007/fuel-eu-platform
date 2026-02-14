# Fuel-EU Compliance & Banking Platform

A comprehensive digital solution for maritime operators to monitor GHG intensity, manage compliance balances, and orchestrate vessel pooling according to Fuel-EU Maritime regulations.

## 🚀 Overview

The Fuel-EU Platform provides a multi-tenant dashboard to:
- **Compare Routes**: Visualize vessel GHG intensity against the 2025 target (89.3368 g/MJ).
- **Manage Banking**: Save compliance surpluses for future periods or apply banked amounts to cover current deficits.
- **Orchestrate Pooling**: Form compliance pools between vessels to optimize fleet-wide compliance.

## 🏗️ Architecture

The project follows **Clean Architecture** principles and a **Hexagonal (Ports & Adapters)** pattern to ensure maintainability and testability.

### Backend (Node.js/Express/Prisma)
- **Core (Domain/Application)**: Contains business logic (CB calculations, pooling algorithms).
- **Adapters (Inbound)**: HTTP Controllers for API interaction.
- **Adapters (Outbound)**: Postgres/Prisma implementation for persistence.

### Frontend (React/TypeScript/Vite)
- **Core (Application/Ports)**: Defines services and interface contracts.
- **Adapters (UI)**: React components styled with Tailwind CSS.
- **Adapters (Infrastructure)**: Axios implementation for API calls.

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL (or local SQLite via Prisma)

### Backend Setup
1. Navigate to `backend/`
2. Install dependencies: `npm install`
3. Set up environment: `cp .env.example .env` (Configure your DB URL)
4. Run migrations & seed: `npx prisma migrate dev && npx prisma db seed`
5. Start server: `npm run dev` (Runs on port 3001)

### Frontend Setup
1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Run tests: `npm test`

## 📡 API Examples

### Comparison
`GET /api/routes/comparison`
Returns baseline and non-baseline routes for intensity analysis.

### Banking
`POST /api/banking/bank`
```json
{
  "shipId": "SHIP001",
  "year": 2025
}
```

### Pooling
`POST /api/pools`
```json
{
  "name": "North Sea Pool",
  "year": 2025,
  "members": [
    { "shipId": "SHIP-ALPHA", "cbBefore": 1200 },
    { "shipId": "SHIP-BETA", "cbBefore": -800 }
  ]
}
```

## 📸 Screenshots

| Dashboard | Compliance Comparison |
|-----------|-----------------------|
| ![Dashboard](https://placehold.co/600x400?text=Dashboard+Overview) | ![Comparison](https://placehold.co/600x400?text=GHG+Intensity+Chart) |

---
*Note: This platform is currently in Beta and follows the 2025 GHG Intensity reduction targets.*
