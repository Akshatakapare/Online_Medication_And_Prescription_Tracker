import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getHealthReport } from '../api'

/**
 * HEALTH REPORT PAGE
 * ===================
 * Patient ki detailed health report
 */

function HealthReport() {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))
    const patientId = user.patientInfo?.patientId

    const [report, setReport] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchReport() {
            try {
                const data = await getHealthReport(patientId)
                setReport(data)
            } catch (error) {
                console.log('Error:', error)
            }
            setLoading(false)
        }
        if (patientId) fetchReport()
    }, [patientId])

    // Health status colors
    const statusColors = {
        'EXCELLENT': 'bg-green-100 text-green-700',
        'GOOD': 'bg-blue-100 text-blue-700',
        'MODERATE': 'bg-yellow-100 text-yellow-700',
        'NEEDS_IMPROVEMENT': 'bg-red-100 text-red-700'
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Navbar */}
            <nav className="bg-white shadow-sm px-6 py-3 flex justify-between items-center sticky top-0 z-50">
                <h1 className="text-xl font-bold text-indigo-600">💊 Prescripto</h1>
                <button onClick={() => navigate('/dashboard')}
                    className="text-indigo-600 text-sm hover:underline">
                    ← Back to Dashboard
                </button>
            </nav>

            <div className="p-6 max-w-4xl mx-auto animate-fade-in">

                <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Health Report</h2>

                {loading && <p className="text-gray-500 text-center">Loading report...</p>}

                {report && !report.error && (
                    <>
                        {/* Patient Info */}
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl p-6 mb-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-bold">{report.patientInfo?.fullName}</h3>
                                    <p className="text-blue-100">{report.patientInfo?.patientId}</p>
                                </div>
                                <span className={`px-4 py-2 rounded-lg font-medium ${statusColors[report.healthStatus]}`}>
                                    {report.healthStatus?.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                <div>
                                    <p className="text-blue-200 text-xs">🩸 Blood Group</p>
                                    <p className="font-medium">{report.patientInfo?.bloodGroup || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-blue-200 text-xs">⚠️ Allergies</p>
                                    <p className="font-medium">{report.patientInfo?.allergies || 'None'}</p>
                                </div>
                                <div>
                                    <p className="text-blue-200 text-xs">📋 Prescriptions</p>
                                    <p className="font-medium">{report.totalPrescriptions}</p>
                                </div>
                                <div>
                                    <p className="text-blue-200 text-xs">👨‍⚕️ Doctors</p>
                                    <p className="font-medium">{report.doctorsConsulted}</p>
                                </div>
                            </div>
                        </div>

                        {/* Adherence Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <StatCard title="Total Doses" value={report.adherence?.totalDoses} icon="💊" color="blue" />
                            <StatCard title="Taken" value={report.adherence?.taken} icon="✅" color="green" />
                            <StatCard title="Missed" value={report.adherence?.missed} icon="❌" color="red" />
                            <StatCard title="Adherence" value={report.adherence?.percentage + '%'} icon="📊" color="purple" />
                        </div>

                        {/* Adherence Progress Bar */}
                        <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
                            <h3 className="font-bold text-gray-700 mb-3">📈 Medication Adherence</h3>
                            <div className="w-full bg-gray-200 rounded-full h-4">
                                <div 
                                    className={`h-4 rounded-full transition-all ${
                                        report.adherence?.percentage >= 80 ? 'bg-green-500' :
                                        report.adherence?.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${report.adherence?.percentage || 0}%` }}
                                ></div>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                {report.adherence?.percentage >= 80 ? '✅ Excellent! Keep it up!' :
                                 report.adherence?.percentage >= 50 ? '⚠️ Good, but can improve' :
                                 '❌ Needs improvement - take medicines on time'}
                            </p>
                        </div>

                        {/* Recent History */}
                        <div className="bg-white p-5 rounded-xl shadow-sm">
                            <h3 className="font-bold text-gray-700 mb-4">📋 Recent Medication History</h3>
                            
                            {report.recentHistory?.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No history yet</p>
                            ) : (
                                <div className="space-y-2">
                                    {report.recentHistory?.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-sm">💊 {item.medicineName}</p>
                                                <p className="text-xs text-gray-500">{item.date} • {item.timing}</p>
                                            </div>
                                            <span className={`text-xs px-3 py-1 rounded-lg ${
                                                item.status === 'TAKEN' 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'bg-red-100 text-red-700'
                                            }`}>
                                                {item.status === 'TAKEN' ? '✅ Taken' : '❌ Missed'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {report?.error && (
                    <div className="text-center py-10">
                        <p className="text-red-500">{report.error}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

function StatCard({ title, value, icon, color }) {
    const colors = {
        blue: 'bg-blue-50 text-blue-700',
        green: 'bg-green-50 text-green-700',
        red: 'bg-red-50 text-red-700',
        purple: 'bg-purple-50 text-purple-700'
    }
    return (
        <div className={`p-4 rounded-xl text-center ${colors[color]}`}>
            <p className="text-2xl">{icon}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <p className="text-xs mt-1">{title}</p>
        </div>
    )
}

export default HealthReport