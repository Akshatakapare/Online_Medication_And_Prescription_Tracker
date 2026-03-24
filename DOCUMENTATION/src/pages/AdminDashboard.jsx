import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAdminStats } from '../api'

/**
 * ADMIN DASHBOARD
 * ================
 * Admin ka main dashboard
 * - Total counts (patients, doctors, caregivers)
 * - Quick navigation to manage users
 */

function AdminDashboard() {
    const navigate = useNavigate()

    // Get admin from localStorage
    const user = JSON.parse(localStorage.getItem('user'))

    // Stats state
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    // Check if admin is logged in
    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            navigate('/admin/login')
            return
        }

        // Fetch stats
        async function fetchStats() {
            try {
                const data = await getAdminStats()
                setStats(data)
            } catch (error) {
                console.log('Error:', error)
            }
            setLoading(false)
        }
        fetchStats()
    }, [])

    // Logout
    function handleLogout() {
        localStorage.clear()
        navigate('/')
    }

    return (
        <div className="min-h-screen bg-gray-100">

            {/* ===== NAVBAR ===== */}
            <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center sticky top-0 z-50">
                <h1 className="text-xl font-bold">💊 Prescripto Admin</h1>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-300">👤 {user?.fullName}</span>
                    <button onClick={handleLogout}
                        className="px-4 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600">
                        Logout
                    </button>
                </div>
            </nav>

            <div className="p-6 max-w-6xl mx-auto animate-fade-in">

                {/* ===== WELCOME ===== */}
                <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-2xl p-6 mb-6">
                    <h2 className="text-2xl font-bold">Admin Dashboard 🛡️</h2>
                    <p className="text-gray-300 mt-1">Manage all users from here</p>
                </div>

                {/* ===== STATS CARDS ===== */}
                {loading && <p className="text-center text-gray-500">Loading stats...</p>}

                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        
                        {/* Total Users */}
                        <div className="bg-white p-5 rounded-xl shadow-sm text-center">
                            <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
                            <p className="text-sm text-gray-500 mt-1">👥 Total Users</p>
                        </div>

                        {/* Patients */}
                        <div className="bg-blue-50 p-5 rounded-xl shadow-sm text-center">
                            <p className="text-3xl font-bold text-blue-600">{stats.totalPatients}</p>
                            <p className="text-sm text-blue-700 mt-1">🏥 Patients</p>
                        </div>

                        {/* Doctors */}
                        <div className="bg-green-50 p-5 rounded-xl shadow-sm text-center">
                            <p className="text-3xl font-bold text-green-600">{stats.totalDoctors}</p>
                            <p className="text-sm text-green-700 mt-1">👨‍⚕️ Doctors</p>
                        </div>

                        {/* Caregivers */}
                        <div className="bg-purple-50 p-5 rounded-xl shadow-sm text-center">
                            <p className="text-3xl font-bold text-purple-600">{stats.totalCaregivers}</p>
                            <p className="text-sm text-purple-700 mt-1">🤝 Caregivers</p>
                        </div>
                    </div>
                )}

                {/* ===== PRESCRIPTIONS STAT ===== */}
                {stats && (
                    <div className="bg-yellow-50 p-5 rounded-xl shadow-sm mb-6 text-center">
                        <p className="text-3xl font-bold text-yellow-600">{stats.totalPrescriptions}</p>
                        <p className="text-sm text-yellow-700 mt-1">📋 Total Prescriptions</p>
                    </div>
                )}

                {/* ===== QUICK ACTIONS ===== */}
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <h3 className="font-bold text-gray-700 mb-4">⚡ Manage Users</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        {/* View Patients */}
                        <div onClick={() => navigate('/admin/patients')}
                            className="p-6 rounded-xl text-center cursor-pointer bg-blue-50 hover:bg-blue-100 transition hover:-translate-y-1">
                            <p className="text-4xl mb-2">🏥</p>
                            <p className="font-medium text-gray-800">View Patients</p>
                            <p className="text-sm text-gray-500 mt-1">
                                {stats?.totalPatients || 0} patients
                            </p>
                        </div>

                        {/* View Doctors */}
                        <div onClick={() => navigate('/admin/doctors')}
                            className="p-6 rounded-xl text-center cursor-pointer bg-green-50 hover:bg-green-100 transition hover:-translate-y-1">
                            <p className="text-4xl mb-2">👨‍⚕️</p>
                            <p className="font-medium text-gray-800">View Doctors</p>
                            <p className="text-sm text-gray-500 mt-1">
                                {stats?.totalDoctors || 0} doctors
                            </p>
                        </div>

                        {/* View Caregivers */}
                        <div onClick={() => navigate('/admin/caregivers')}
                            className="p-6 rounded-xl text-center cursor-pointer bg-purple-50 hover:bg-purple-100 transition hover:-translate-y-1">
                            <p className="text-4xl mb-2">🤝</p>
                            <p className="font-medium text-gray-800">View Caregivers</p>
                            <p className="text-sm text-gray-500 mt-1">
                                {stats?.totalCaregivers || 0} caregivers
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard