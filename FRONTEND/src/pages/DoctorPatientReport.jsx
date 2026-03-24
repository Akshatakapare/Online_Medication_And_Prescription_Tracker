import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPatientReport } from '../api'

/**
 * DOCTOR PATIENT REPORT PAGE
 * ===========================
 * Shows detailed medication report of a specific patient
 * Includes: Patient info, adherence stats, recent history
 */

function DoctorPatientReport() {
    const navigate = useNavigate()
    
    // Get patientId from URL params
    // Example: /doctor/patient-report/PAT-ABC123 -> patientId = "PAT-ABC123"
    const { patientId } = useParams()
    
    // State variables
    const [report, setReport] = useState(null)
    const [loading, setLoading] = useState(true)

    // Fetch report when page loads
    useEffect(() => {
        async function fetchReport() {
            try {
                const data = await getPatientReport(patientId)
                setReport(data)
            } catch (error) {
                console.log('Error fetching report:', error)
            }
            setLoading(false)
        }
        
        if (patientId) {
            fetchReport()
        }
    }, [patientId])

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500">⏳ Loading report...</p>
            </div>
        )
    }

    // Error state
    if (!report || report.error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-4xl mb-2">❌</p>
                    <p className="text-gray-500">{report?.error || 'Patient not found'}</p>
                    <button onClick={() => navigate('/doctor/my-patients')}
                        className="mt-4 text-indigo-600 hover:underline">
                        ← Back to My Patients
                    </button>
                </div>
            </div>
        )
    }

    // Destructure report data
    const { patient, stats, recentHistory, totalPrescriptions } = report

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ===== NAVBAR ===== */}
            <nav className="bg-white shadow-sm px-6 py-3 flex justify-between items-center sticky top-0 z-50">
                <h1 className="text-xl font-bold text-indigo-600">💊 Prescripto</h1>
                <button onClick={() => navigate('/doctor/my-patients')}
                    className="text-indigo-600 text-sm hover:underline">
                    ← Back to My Patients
                </button>
            </nav>

            <div className="p-6 max-w-4xl mx-auto animate-fade-in">

                {/* ===== PATIENT INFO CARD ===== */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl p-6 mb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold">{patient.fullName}</h2>
                            <p className="text-blue-100 mt-1">{patient.patientId}</p>
                        </div>
                        {patient.bloodGroup && (
                            <span className="px-3 py-1 bg-white/20 rounded-lg text-sm">
                                🩸 {patient.bloodGroup}
                            </span>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                            <p className="text-blue-200 text-xs">📱 Phone</p>
                            <p className="font-medium">{patient.phone || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-blue-200 text-xs">📧 Email</p>
                            <p className="font-medium text-sm">{patient.email || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-blue-200 text-xs">📋 Prescriptions</p>
                            <p className="font-medium">{totalPrescriptions}</p>
                        </div>
                        <div>
                            <p className="text-blue-200 text-xs">⚠️ Allergies</p>
                            <p className="font-medium">{patient.allergies || 'None'}</p>
                        </div>
                    </div>
                </div>

                {/* ===== ADHERENCE STATS ===== */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    
                    {/* Total Doses */}
                    <div className="bg-white p-4 rounded-xl shadow-sm text-center animate-slide-up">
                        <p className="text-3xl font-bold text-gray-800">{stats.totalDoses}</p>
                        <p className="text-xs text-gray-500 mt-1">📊 Total Doses</p>
                    </div>
                    
                    {/* Taken */}
                    <div className="bg-green-50 p-4 rounded-xl shadow-sm text-center animate-slide-up">
                        <p className="text-3xl font-bold text-green-600">{stats.taken}</p>
                        <p className="text-xs text-green-700 mt-1">✅ Taken</p>
                    </div>
                    
                    {/* Missed */}
                    <div className="bg-red-50 p-4 rounded-xl shadow-sm text-center animate-slide-up">
                        <p className="text-3xl font-bold text-red-600">{stats.missed}</p>
                        <p className="text-xs text-red-700 mt-1">❌ Missed</p>
                    </div>
                    
                    {/* Adherence Percentage */}
                    <div className="bg-blue-50 p-4 rounded-xl shadow-sm text-center animate-slide-up">
                        <p className="text-3xl font-bold text-blue-600">{stats.adherencePercentage}%</p>
                        <p className="text-xs text-blue-700 mt-1">📈 Adherence</p>
                    </div>
                </div>

                {/* ===== ADHERENCE BAR ===== */}
                <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
                    <h3 className="font-bold text-gray-700 mb-3">📊 Adherence Progress</h3>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                            className={`h-4 rounded-full transition-all duration-500 ${
                                stats.adherencePercentage >= 80 ? 'bg-green-500' :
                                stats.adherencePercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${stats.adherencePercentage}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        {stats.adherencePercentage >= 80 ? '✅ Excellent adherence!' :
                         stats.adherencePercentage >= 50 ? '⚠️ Moderate adherence' : 
                         '❌ Needs improvement'}
                    </p>
                </div>

                {/* ===== RECENT HISTORY ===== */}
                <div className="bg-white p-5 rounded-xl shadow-sm">
                    <h3 className="font-bold text-gray-700 mb-4">📋 Recent Medication History</h3>
                    
                    {recentHistory.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No medication history yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {recentHistory.map((item, index) => (
                                <div key={index} 
                                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    
                                    {/* Medicine Info */}
                                    <div>
                                        <p className="font-medium text-sm text-gray-800">
                                            💊 {item.medicineName}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {item.date} • {item.timing}
                                        </p>
                                    </div>
                                    
                                    {/* Status Badge */}
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

                {/* ===== ACTION BUTTON ===== */}
                <div className="mt-6 text-center">
                    <button onClick={() => navigate('/create-prescription')}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition btn-press">
                        ➕ Add New Prescription
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DoctorPatientReport