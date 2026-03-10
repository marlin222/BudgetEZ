import React, { useState } from 'react'
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
import './YearlySummary.css'

function YearlySummary({ transactions, recurringExpenses = [] }) {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)

  const availableYears = [...new Set(transactions.map(t => new Date(t.date).getFullYear()))].sort((a, b) => b - a)
  if (!availableYears.includes(currentYear)) availableYears.unshift(currentYear)

  const yearTransactions = transactions.filter(t => new Date(t.date).getFullYear() === selectedYear)

  const getMonthlyAmount = (amount, frequency) => {
    switch (frequency) {
      case 'weekly': return amount * (52 / 12)
      case 'monthly': return amount
      case 'yearly': return amount / 12
      default: return amount
    }
  }

  const recurringMonthlyTotal = recurringExpenses.reduce(
    (sum, e) => sum + getMonthlyAmount(e.amount, e.frequency), 0
  )
  const recurringYearlyTotal = recurringMonthlyTotal * 12

  const totalIncome = yearTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses =
    yearTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0) +
    recurringYearlyTotal

  const totalBalance = totalIncome - totalExpenses

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const monthlyData = MONTHS.map((month, index) => {
    const monthTransactions = yearTransactions.filter(t => new Date(t.date).getMonth() === index)
    const income = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
    const expenses =
      monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0) +
      recurringMonthlyTotal
    return {
      month,
      income: parseFloat(income.toFixed(2)),
      expenses: parseFloat(expenses.toFixed(2)),
      balance: parseFloat((income - expenses).toFixed(2)),
    }
  })

  const categoryBreakdown = {}
  yearTransactions.filter(t => t.type === 'expense').forEach(t => {
    categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount
  })
  recurringExpenses.forEach(e => {
    const yearlyAmount = getMonthlyAmount(e.amount, e.frequency) * 12
    categoryBreakdown[e.category] = (categoryBreakdown[e.category] || 0) + yearlyAmount
  })

  const categoryData = Object.entries(categoryBreakdown).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: parseFloat(value.toFixed(2)),
  }))

  const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899']

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

  return (
    <div className="yearly-summary">
      <div className="yearly-header">
        <h2>Yearly Report</h2>
        <select
          className="year-select"
          value={selectedYear}
          onChange={e => setSelectedYear(Number(e.target.value))}
        >
          {availableYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card income-card">
          <div className="card-label">Total Income</div>
          <div className="card-value">{formatCurrency(totalIncome)}</div>
        </div>
        <div className="card expense-card">
          <div className="card-label">Total Expenses</div>
          <div className="card-value">{formatCurrency(totalExpenses)}</div>
        </div>
        <div className="card recurring-card">
          <div className="card-label">Recurring (Yearly)</div>
          <div className="card-value">{formatCurrency(recurringYearlyTotal)}</div>
        </div>
        <div className={`card balance-card ${totalBalance >= 0 ? 'positive' : 'negative'}`}>
          <div className="card-label">Balance</div>
          <div className="card-value">{formatCurrency(totalBalance)}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts">
        <div className="chart-container chart-wide">
          <h3>Monthly Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="income" fill="#10b981" name="Income" />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

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

      {/* Monthly Breakdown Table */}
      <div className="monthly-breakdown">
        <h3>Month-by-Month Breakdown</h3>
        <table className="breakdown-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Income</th>
              <th>Expenses</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {monthlyData.map(row => (
              <tr key={row.month}>
                <td>{row.month}</td>
                <td className="income-text">{formatCurrency(row.income)}</td>
                <td className="expense-text">{formatCurrency(row.expenses)}</td>
                <td className={row.balance >= 0 ? 'positive-text' : 'negative-text'}>
                  {formatCurrency(row.balance)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td><strong>Total</strong></td>
              <td className="income-text"><strong>{formatCurrency(totalIncome)}</strong></td>
              <td className="expense-text"><strong>{formatCurrency(totalExpenses)}</strong></td>
              <td className={totalBalance >= 0 ? 'positive-text' : 'negative-text'}>
                <strong>{formatCurrency(totalBalance)}</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {yearTransactions.length === 0 && recurringExpenses.length === 0 && (
        <div className="no-data">
          <p>No transactions for {selectedYear}. Add some to see your yearly report!</p>
        </div>
      )}
    </div>
  )
}

export default YearlySummary
