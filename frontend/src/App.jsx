import { useState, useEffect } from 'react'
import axios from 'axios'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import RecurringExpenses from './components/RecurringExpenses'
import MonthlySummary from './components/MonthlySummary'
import LoginPage from './components/LoginPage'
import './App.css'

// Attach token to every request
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// On 401, clear token and reload to show login
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.reload()
    }
    return Promise.reject(error)
  }
)

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [activeTab, setActiveTab] = useState('transactions')
  const [transactions, setTransactions] = useState([])
  const [recurringExpenses, setRecurringExpenses] = useState([])
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (token) {
      fetchTransactions()
      fetchRecurringExpenses()
    }
  }, [refreshKey, token])

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('/api/transactions/')
      setTransactions(response.data)
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    }
  }

  const fetchRecurringExpenses = async () => {
    try {
      const response = await axios.get('/api/recurring/')
      setRecurringExpenses(response.data)
    } catch (error) {
      console.error('Failed to fetch recurring expenses:', error)
    }
  }

  const handleTransactionAdded = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleLogin = (accessToken) => {
    localStorage.setItem('token', accessToken)
    setToken(accessToken)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setTransactions([])
    setRecurringExpenses([])
  }

  if (!token) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>💰 BudgetEZ</h1>
          <p>Income & Expense Tracker</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Log Out</button>
      </header>

      <nav className="tabs">
        <button
          className={`tab ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </button>
        <button
          className={`tab ${activeTab === 'recurring' ? 'active' : ''}`}
          onClick={() => setActiveTab('recurring')}
        >
          Recurring
        </button>
        <button
          className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          Monthly Summary
        </button>
      </nav>

      <main className="content">
        {activeTab === 'transactions' && (
          <div>
            <TransactionForm onTransactionAdded={handleTransactionAdded} />
            <TransactionList transactions={transactions} />
          </div>
        )}
        {activeTab === 'recurring' && (
          <RecurringExpenses onUpdate={handleTransactionAdded} />
        )}
        {activeTab === 'summary' && (
          <MonthlySummary transactions={transactions} recurringExpenses={recurringExpenses} />
        )}
      </main>
    </div>
  )
}

export default App
