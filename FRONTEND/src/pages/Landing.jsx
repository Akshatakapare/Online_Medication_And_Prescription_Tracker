import { useNavigate } from 'react-router-dom'

function Landing() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

            {/* ===== NAVBAR ===== */}
            <nav className="flex justify-between items-center px-8 py-4 bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
                <h1 className="text-2xl font-bold text-indigo-600">💊 Prescripto</h1>
                <div className="flex gap-3">
                    <button onClick={() => navigate('/login')}
                        className="px-5 py-2 text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition btn-press">
                        Login
                    </button>
                    <button onClick={() => navigate('/register')}
                        className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition btn-press">
                        Register
                    </button>
                </div>
            </nav>

            {/* ===== HERO ===== */}
            <div className="flex flex-col items-center text-center px-4 py-20 animate-fade-in">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                    Manage Your <span className="text-indigo-600">Medications</span>
                    <br />Effortlessly
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mb-8">
                    Track prescriptions, set reminders, and never miss a dose again. 
                    Your complete digital health companion.
                </p>
                <div className="flex gap-4">
                    <button onClick={() => navigate('/register')}
                        className="px-8 py-3 bg-indigo-600 text-white text-lg rounded-lg hover:bg-indigo-700 shadow-lg transition btn-press">
                        🚀 Get Started Free
                    </button>
                    <button onClick={() => navigate('/login')}
                        className="px-8 py-3 border-2 border-gray-300 text-gray-700 text-lg rounded-lg hover:border-indigo-600 hover:text-indigo-600 transition btn-press">
                        I have an account
                    </button>
                </div>
            </div>

            {/* ===== FEATURES ===== */}
            <div className="px-8 py-16 bg-white">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                    Why Choose Prescripto?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <FeatureCard icon="📋" title="Digital Prescriptions"
                        desc="Store all your prescriptions digitally. Access them anytime." color="blue" />
                    <FeatureCard icon="⏰" title="Smart Reminders"
                        desc="Never miss a dose with timely medication reminders." color="green" />
                    <FeatureCard icon="👨‍👩‍👧" title="Family Care"
                        desc="Caregivers can monitor medications for loved ones." color="purple" />
                </div>
            </div>

            {/* ===== FOR WHO ===== */}
            <div className="px-8 py-16">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                    Perfect For Everyone
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <RoleCard icon="🏥" title="Patients" desc="Track medications, view prescriptions, stay healthy." />
                    <RoleCard icon="👨‍⚕️" title="Doctors" desc="Create prescriptions, monitor patient adherence." />
                    <RoleCard icon="🤝" title="Caregivers" desc="Help loved ones manage medications effectively." />
                </div>
            </div>

            {/* ===== FOOTER ===== */}
            <footer className="bg-gray-800 text-white py-8 text-center">
                <p className="text-lg font-bold mb-1">💊 Prescripto</p>
                <p className="text-gray-400 text-sm">Your Health, Our Priority</p>
                <p className="text-gray-500 text-xs mt-4">© 2024 Prescripto. All rights reserved.</p>
            
            {/* Admin Login Link */}
<p onClick={() => navigate('/admin/login')}
    className="text-gray-500 text-xs mt-3 cursor-pointer hover:text-gray-300">
    🔐 Admin Login
</p>
            
            </footer>
        </div>
    )
}

// Reusable Feature Card
function FeatureCard({ icon, title, desc, color }) {
    const bg = { blue: 'bg-blue-50', green: 'bg-green-50', purple: 'bg-purple-50' }
    return (
        <div className={`p-6 ${bg[color]} rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600">{desc}</p>
        </div>
    )
}

// Reusable Role Card
function RoleCard({ icon, title, desc }) {
    return (
        <div className="p-8 bg-white rounded-xl shadow-lg text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="text-6xl mb-4">{icon}</div>
            <h3 className="text-2xl font-bold text-indigo-600 mb-2">{title}</h3>
            <p className="text-gray-600">{desc}</p>
        </div>
    )
}

export default Landing