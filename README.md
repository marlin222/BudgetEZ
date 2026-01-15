# BudgetEZ

A modern, full-stack income and expense tracker for everyday life.

**Features:**
- ✨ Add and track income/expenses with categories
- 🔄 Set up recurring expenses (weekly, monthly, yearly)
- 📊 Monthly summary with charts (income vs expenses, category breakdown)
- 🎨 Beautiful, responsive UI
- 🏗️ Full-stack: React frontend + Python FastAPI backend
- 🗄️ MongoDB for transactions, PostgreSQL for recurring expenses

## Tech Stack

**Frontend:**
- React 18 with Vite
- Axios for API calls
- Recharts for data visualization
- CSS for styling

**Backend:**
- FastAPI (Python)
- MongoDB (async with Motor) for transactions
- PostgreSQL with SQLAlchemy for recurring expenses
- CORS enabled for local development

## Quick Start

### Prerequisites
- Node.js 18+ & npm
- Python 3.9+
- Docker & Docker Compose

### 1. Start Databases

```bash
docker-compose up -d
```

This starts MongoDB and PostgreSQL locally.

### 2. Set up Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
python main.py
```

Backend runs on `http://localhost:8000`

### 3. Set up Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` with API proxy to backend.

### API Endpoints

**Transactions (MongoDB):**
- `GET /transactions` - List all transactions
- `POST /transactions` - Create transaction
- `DELETE /transactions/{id}` - Delete transaction

**Recurring Expenses (PostgreSQL):**
- `GET /recurring` - List all recurring expenses
- `POST /recurring` - Create recurring expense
- `DELETE /recurring/{id}` - Delete recurring expense

### Project Structure

```
BudgetEZ/
├── frontend/                # React app (Vite)
│   ├── src/
│   │   ├── components/     # TransactionForm, TransactionList, etc.
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── backend/                 # Python FastAPI
│   ├── routes/             # API endpoints
│   │   ├── transactions.py
│   │   └── recurring.py
│   ├── db/                 # Database configs
│   │   ├── mongodb.py
│   │   ├── postgresql.py
│   │   └── models.py
│   ├── main.py
│   ├── config.py
│   ├── schemas.py
│   └── requirements.txt
├── docker-compose.yml
└── README.md
```

### Development Notes

- **Transactions** stored in MongoDB for flexible schema
- **Recurring expenses** stored in PostgreSQL for relational integrity
- Frontend proxies `/api/*` requests to backend in `vite.config.js`
- Add a `.env` file in `backend/` from `.env.example` for custom DB URLs

### Stopping Databases

```bash
docker-compose down
```

To remove volumes:

```bash
docker-compose down -v
```

## Next Steps

- Add user authentication (JWT)
- Budget limits & alerts
- Recurring expense auto-generation in transactions
- Export transactions to CSV
- Mobile app (React Native)
