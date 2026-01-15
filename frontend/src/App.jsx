import React, { useState, useEffect } from 'react'
import axios from 'axios'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import RecurringExpenses from './components/RecurringExpenses'
import MonthlySummary from './components/MonthlySummary'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('transactions')
  const [transactions, setTransactions] = useState([])
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    fetchTransactions()
  }, [refreshKey])

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('/api/transactions')
      setTransactions(response.data)
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    }
  }

  const handleTransactionAdded = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>💰 BudgetEZ</h1>
        <p>Income & Expense Tracker</p>
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
          <MonthlySummary transactions={transactions} />
        )}
      </main>
    </div>
  )
}

export default App
