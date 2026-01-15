import React, { useState } from 'react'
import axios from 'axios'
import './TransactionForm.css'

function TransactionForm({ onTransactionAdded }) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: 'other',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const categories = {
    income: ['salary', 'freelance', 'investment', 'other'],
    expense: ['food', 'transport', 'utilities', 'entertainment', 'shopping', 'health', 'other'],
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'type' && { category: 'other' }),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.description || !formData.amount) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')
    try {
      await axios.post('/api/transactions', {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date().toISOString(),
      })
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        category: 'other',
      })
      onTransactionAdded()
    } catch (err) {
      setError('Failed to add transaction')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <h2>Add Transaction</h2>
      
      {error && <div className="error">{error}</div>}
      
      <div className="form-group">
        <label>Description</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="e.g., Lunch, Salary"
        />
      </div>

      <div className="form-group">
        <label>Amount</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          step="0.01"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Type</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div className="form-group">
          <label>Category</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            {categories[formData.type].map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Transaction'}
      </button>
    </form>
  )
}

export default TransactionForm
