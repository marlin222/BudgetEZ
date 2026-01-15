import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './RecurringExpenses.css'

function RecurringExpenses({ onUpdate }) {
  const [recurring, setRecurring] = useState([])
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    frequency: 'monthly',
    category: 'utilities',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchRecurring()
  }, [])

  const fetchRecurring = async () => {
    try {
      const response = await axios.get('/api/recurring')
      setRecurring(response.data)
    } catch (error) {
      console.error('Failed to fetch recurring expenses:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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
      await axios.post('/api/recurring', {
        ...formData,
        amount: parseFloat(formData.amount),
      })
      setFormData({
        description: '',
        amount: '',
        frequency: 'monthly',
        category: 'utilities',
      })
      fetchRecurring()
      onUpdate()
    } catch (err) {
      setError('Failed to add recurring expense')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/recurring/${id}`)
      fetchRecurring()
      onUpdate()
    } catch (error) {
      console.error('Failed to delete recurring expense:', error)
    }
  }

  return (
    <div className="recurring-expenses">
      <h2>Recurring Expenses</h2>
      
      <form className="recurring-form" onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}
        
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g., Netflix subscription"
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
            <label>Frequency</label>
            <select name="frequency" value={formData.frequency} onChange={handleChange}>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="utilities">Utilities</option>
              <option value="subscription">Subscription</option>
              <option value="rent">Rent</option>
              <option value="insurance">Insurance</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Recurring Expense'}
        </button>
      </form>

      <div className="recurring-list">
        <h3>Your Recurring Expenses</h3>
        {recurring.length === 0 ? (
          <p className="no-items">No recurring expenses yet.</p>
        ) : (
          recurring.map(item => (
            <div key={item._id} className="recurring-item">
              <div>
                <div className="item-description">{item.description}</div>
                <div className="item-meta">
                  {item.frequency} • ${item.amount.toFixed(2)}
                </div>
              </div>
              <button
                className="delete-btn"
                onClick={() => handleDelete(item._id)}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default RecurringExpenses
