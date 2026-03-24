import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPatientByPatientId, getAdherenceStats } from '../api'

/**
 * CAREGIVER PATIENT DETAILS PAGE
 * ===============================
 * Shows complete details of the linked patient
 * Includes: Personal info, medical info, adherence stats
 */

function CaregiverPatientDetails() {
    const navigate = useNavigate()
    
    // Get logged in caregiver from localStorage
    const user = JSON.parse(localStorage.getItem('user'))
    const linkedPatientId = user.caregiverInfo?.assignedPatientId
    
    // State variables
    const [patient, setPatient] = useState(null)
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    // Fetch patient details when page loads
    useEffect(() => {
        async function fetchData() {
            try {
                // Get patient details
                const patientData = await getPatientByPatientId(linkedPatientId)
                setPatient(patientData)
                
                // Get adherence stats
                const statsData = await getAdherenceStats(linkedPatientId)
                setStats(statsData)
            } catch (error) {
                console.log('Error fetching patient:', error)
            }
            setLoading(false)
        }
        
        if (linkedPatientId) {
            fetchData()
        } else {
            setLoading(false)
        }
    }, [linkedPatientId])

    // No linked patient
    if (!linkedPatientId) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-4xl mb-2">⚠️</p>
                    <p className="text-gray-500">No patient linked to your account.</p>
                    <button onClick={() => navigate('/dashboard')}
                        className="mt-4 text-indigo-600 hover:underline">
                        ← Back to Dashboard
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ===== NAVBAR ===== */}
            <nav className="bg-white shadow-sm px-6 py-3 flex justify-between items-center sticky top-0 z-50">
                <h1 className="text-xl font-bold text-indigo-600">💊 Prescripto</h1>
                <button onClick={() => navigate('/dashboard')}
                    className="text-indigo-600 text-sm hover:underline">
                    ← Back to Dashboard
                </button>
            </nav>

            <div className="p-6 max-w-4xl mx-auto animate-fade-in">

                {/* ===== PAGE TITLE ===== */}
                <h2 className="text-2xl font-bold text-gray-800 mb-6">👤 Patient Details</h2>

                {/* ===== LOADING STATE ===== */}
                {loading && (
                    <div className="text-center py-10">
                        <p className="text-gray-500">⏳ Loading patient details...</p>
                    </div>
                )}

                {/* ===== PATIENT NOT FOUND ===== */}
                {!loading && !patient && (
                    <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                        <p className="text-4xl mb-2">❌</p>
                        <p className="text-gray-500">Patient not found.</p>
                    </div>
                )}

                {/* ===== PATIENT DETAILS ===== */}
                {patient && (
                    <>
                        {/* Header Card */}
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl p-6 mb-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-bold">{patient.fullName}</h3>
                                    <p className="text-blue-100 mt-1">{patient.patientInfo?.patientId}</p>
                                </div>
                                {patient.patientInfo?.bloodGroup && (
                                    <span className="px-3 py-1 bg-white/20 rounded-lg">
                                        🩸 {patient.patientInfo.bloodGroup}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                            {/* ===== PERSONAL INFO ===== */}
                            <div className="bg-white rounded-xl shadow-sm p-5 animate-slide-up">
                                <h3 className="font-bold text-gray-700 mb-3">📝 Personal Information</h3>
                                <InfoRow label="Full Name" value={patient.fullName} />
                                <InfoRow label="Phone" value={patient.phone} />
                                <InfoRow label="Email" value={patient.email} />
                                <InfoRow label="Gender" value={patient.gender} />
                                <InfoRow label="Date of Birth" value={patient.dateOfBirth} />
                                <InfoRow label="City" value={patient.city} />
                            </div>

                            {/* ===== MEDICAL INFO ===== */}
                            <div className="bg-blue-50 rounded-xl shadow-sm p-5 animate-slide-up">
                                <h3 className="font-bold text-blue-700 mb-3">🏥 Medical Information</h3>
                                <InfoRow label="Patient ID" value={patient.patientInfo?.patientId} />
                                <InfoRow label="Blood Group" value={patient.patientInfo?.bloodGroup} />
                                <InfoRow label="Allergies" value={patient.patientInfo?.allergies || 'None'} />
                                <InfoRow label="Emergency Contact" value={patient.patientInfo?.emergencyContactName} />
                                <InfoRow label="Emergency Phone" value={patient.patientInfo?.emergencyContactPhone} />
                            </div>
                        </div>

                        {/* ===== ADHERENCE STATS ===== */}
                        {stats && (
                            <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
                                <h3 className="font-bold text-gray-700 mb-4">📊 Medication Adherence</h3>
                                
                                <div className="grid grid-cols-4 gap-4 mb-4">
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <p className="text-2xl font-bold text-gray-800">{stats.totalDoses}</p>
                                        <p className="text-xs text-gray-500">Total</p>
                                    </div>
                                    <div className="text-center p-3 bg-green-50 rounded-lg">
                                        <p className="text-2xl font-bold text-green-600">{stats.taken}</p>
                                        <p className="text-xs text-green-700">Taken</p>
                                    </div>
                                    <div className="text-center p-3 bg-red-50 rounded-lg">
                                        <p className="text-2xl font-bold text-red-600">{stats.missed}</p>
                                        <p className="text-xs text-red-700">Missed</p>
                                    </div>
                                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                                        <p className="text-2xl font-bold text-blue-600">{stats.adherencePercentage}%</p>
                                        <p className="text-xs text-blue-700">Adherence</p>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div 
                                        className={`h-3 rounded-full ${
                                            stats.adherencePercentage >= 80 ? 'bg-green-500' :
                                            stats.adherencePercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                        style={{ width: `${stats.adherencePercentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {/* ===== QUICK ACTIONS ===== */}
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => navigate('/caregiver/medicine-status')}
                                className="p-4 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition btn-press">
                                💊 View Today's Medicines
                            </button>
                            <button onClick={() => navigate('/caregiver/prescriptions')}
                                className="p-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition btn-press">
                                📋 View Prescriptions
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

// ===== REUSABLE COMPONENT =====
function InfoRow({ label, value }) {
    return (
        <div className="flex justify-between py-1.5 border-b border-gray-100 text-sm">
            <span className="text-gray-500">{label}</span>
            <span className="font-medium text-gray-800">{value || 'N/A'}</span>
        </div>
    )
}

export default CaregiverPatientDetails