import React from 'react'
import './TransactionList.css'

function TransactionList({ transactions }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date))

  if (sorted.length === 0) {
    return <div className="no-transactions">No transactions yet. Add one to get started!</div>
  }

  return (
    <div className="transaction-list">
      <h2>Recent Transactions</h2>
      <div className="transactions">
        {sorted.map(transaction => (
          <div key={transaction._id} className={`transaction-item ${transaction.type}`}>
            <div className="transaction-info">
              <div className="description">{transaction.description}</div>
              <div className="category">{transaction.category}</div>
            </div>
            <div className="transaction-date">{formatDate(transaction.date)}</div>
            <div className={`amount ${transaction.type}`}>
              {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TransactionList
