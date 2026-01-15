import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import './MonthlySummary.css'

function MonthlySummary({ transactions }) {
  const currentMonth = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })

  // Calculate totals
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = income - expenses

  // Category breakdown
  const categoryBreakdown = {}
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount
    })

  const categoryData = Object.entries(categoryBreakdown).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: parseFloat(value.toFixed(2)),
  }))

  // Summary stats
  const summaryData = [
    { name: 'Income', value: income },
    { name: 'Expenses', value: expenses },
  ]

  const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899']

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <div className="monthly-summary">
      <h2>Monthly Summary - {currentMonth}</h2>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card income-card">
          <div className="card-label">Total Income</div>
          <div className="card-value">{formatCurrency(income)}</div>
        </div>
        <div className="card expense-card">
          <div className="card-label">Total Expenses</div>
          <div className="card-value">{formatCurrency(expenses)}</div>
        </div>
        <div className={`card balance-card ${balance >= 0 ? 'positive' : 'negative'}`}>
          <div className="card-label">Balance</div>
          <div className="card-value">{formatCurrency(balance)}</div>
        </div>
      </div>

      {/* Charts */}
      {summaryData.length > 0 && (
        <div className="charts">
          {/* Income vs Expenses Bar Chart */}
          <div className="chart-container">
            <h3>Income vs Expenses</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={summaryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="value" fill="#667eea" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Expense Breakdown Pie Chart */}
          {categoryData.length > 0 && (
            <div className="chart-container">
              <h3>Expense Breakdown by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* No data state */}
      {transactions.length === 0 && (
        <div className="no-data">
          <p>No transactions this month. Add some to see your summary!</p>
        </div>
      )}
    </div>
  )
}

export default MonthlySummary
