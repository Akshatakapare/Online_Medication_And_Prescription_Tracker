import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from '../api'

/**
 * ADMIN LOGIN PAGE
 * =================
 * Hardcoded credentials:
 * Email: admin@prescripto.com
 * Password: admin123
 */

function AdminLogin() {
    const navigate = useNavigate()

    // Form state
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    // Handle login
    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            const response = await adminLogin(email, password)

            if (response.success) {
                // Save admin data in localStorage
                localStorage.setItem('user', JSON.stringify({
                    role: 'ADMIN',
                    email: response.email,
                    fullName: response.fullName,
                    token: response.token
                }))
                localStorage.setItem('token', response.token)

                setMessage('✅ Login successful!')

                // Redirect to admin dashboard
                setTimeout(() => navigate('/admin/dashboard'), 800)
            } else {
                setMessage(response.message)
            }
        } catch (error) {
            setMessage('Something went wrong!')
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center px-4">
            <div className="w-full max-w-md animate-fade-in">

                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 onClick={() => navigate('/')}
                        className="text-3xl font-bold text-white cursor-pointer">
                        💊 Prescripto
                    </h1>
                    <p className="text-gray-400 mt-2">Admin Panel</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
                        Admin Login 🔐
                    </h2>
                    <p className="text-gray-500 text-center mb-6">
                        Enter admin credentials
                    </p>

                    {/* Message */}
                    {message && (
                        <div className={`p-3 rounded-lg mb-4 text-center text-sm ${
                            message.includes('✅') 
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                        }`}>
                            {message}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit}>

                        {/* Email */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                                📧 Email
                            </label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="admin@prescripto.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                                🔒 Password
                            </label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Enter password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                            />
                        </div>

                        {/* Submit */}
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition disabled:bg-gray-400"
                        >
                            {loading ? '⏳ Logging in...' : '🔐 Login as Admin'}
                        </button>
                    </form>

                    {/* Link to user login */}
                    <p className="text-center mt-6 text-gray-500 text-sm">
                        Not admin?{' '}
                        <span onClick={() => navigate('/login')}
                            className="text-indigo-600 cursor-pointer hover:underline">
                            User Login
                        </span>
                    </p>
                </div>

                {/* Back to home */}
                <p onClick={() => navigate('/')}
                    className="text-center mt-6 text-gray-400 cursor-pointer hover:text-white text-sm">
                    ← Back to Home
                </p>
            </div>
        </div>
    )
}

export default AdminLogin