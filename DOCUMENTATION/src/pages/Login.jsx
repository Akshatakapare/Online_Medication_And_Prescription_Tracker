import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../api'

function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            const response = await loginUser(email, password)

            // Check for errors
            if (response.error) {
                setMessage(response.error)
            } else if (response.id) {
                localStorage.setItem('user', JSON.stringify(response))
                localStorage.setItem('token', response.token)
                setMessage('✅ Login successful!')
                setTimeout(() => navigate('/dashboard'), 800)
            } else {
                setMessage('Invalid email or password!')
            }
        } catch (error) {
            setMessage('Something went wrong!')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md animate-fade-in">

                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 onClick={() => navigate('/')}
                        className="text-3xl font-bold text-indigo-600 cursor-pointer">
                        💊 Prescripto
                    </h1>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Welcome Back! 👋</h2>
                    <p className="text-gray-500 text-center mb-6">Login to your account</p>

                    {/* Message */}
                    {message && (
                        <div className={`p-3 rounded-lg mb-4 text-center text-sm animate-fade-in ${
                            message.includes('successful') || message.includes('✅')
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                        }`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-1">📧 Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                required placeholder="Enter your email"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition" />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-medium mb-1">🔒 Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                required placeholder="Enter your password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition" />
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition btn-press disabled:bg-indigo-400">
                            {loading ? '⏳ Logging in...' : '🔐 Login'}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-gray-600 text-sm">
                        Don't have an account?{' '}
                        <span onClick={() => navigate('/register')}
                            className="text-indigo-600 font-medium cursor-pointer hover:underline">
                            Register here
                        </span>
                    </p>
                </div>

                <p onClick={() => navigate('/')}
                    className="text-center mt-6 text-gray-500 cursor-pointer hover:text-indigo-600 text-sm">
                    ← Back to Home
                </p>
            </div>
        </div>
    )
}

export default Login