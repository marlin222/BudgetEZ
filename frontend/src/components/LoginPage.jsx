import { useState } from 'react'
import axios from 'axios'
import './LoginPage.css'

function validatePassword(password) {
  if (password.length <= 8) return 'Password must be longer than 8 characters'
  if (!/\d/.test(password)) return 'Password must contain at least one digit'
  if (!/[!@#$%^&*(),.?":{}|<>\[\]_\-+=\\;'`~/]/.test(password)) return 'Password must contain at least one special character'
  return null
}

function LoginPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username || !password) {
      setError('Please fill in all fields')
      return
    }
    if (isRegister) {
      const pwError = validatePassword(password)
      if (pwError) { setError(pwError); return }
    }

    setLoading(true)
    setError('')
    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login'
      const response = await axios.post(endpoint, { username, password })
      onLogin(response.data.access_token)
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>💰 BudgetEZ</h1>
        <p className="login-subtitle">Your personal income & expense tracker</p>

        <h2>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>

        <form onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. john123"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            {isRegister && (
              <p className="password-hint">Must be 8+ characters with at least one digit and one special character</p>
            )}
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Please wait...' : isRegister ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <p className="toggle-text">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          {' '}
          <button className="toggle-btn" onClick={() => { setIsRegister(!isRegister); setError('') }}>
            {isRegister ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
