import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDoctorPatients } from '../api'

/**
 * DOCTOR MY PATIENTS PAGE
 * ========================
 * Shows list of all patients that this doctor has prescribed to
 * Doctor can click on any patient to see their report
 */

function DoctorMyPatients() {
    const navigate = useNavigate()
    
    // Get logged in user from localStorage
    const user = JSON.parse(localStorage.getItem('user'))
    
    // State variables
    const [patients, setPatients] = useState([])  // Patients list
    const [loading, setLoading] = useState(true)   // Loading state

    // Fetch patients when page loads
    useEffect(() => {
        async function fetchPatients() {
            try {
                // API call to get doctor's patients
                const data = await getDoctorPatients(user.id)
                setPatients(data)
            } catch (error) {
                console.log('Error fetching patients:', error)
            }
            setLoading(false)
        }
        
        fetchPatients()
    }, [user.id])

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
                <h2 className="text-2xl font-bold text-gray-800 mb-6">👥 My Patients</h2>

                {/* ===== LOADING STATE ===== */}
                {loading && (
                    <div className="text-center py-10">
                        <p className="text-gray-500">⏳ Loading patients...</p>
                    </div>
                )}

                {/* ===== NO PATIENTS ===== */}
                {!loading && patients.length === 0 && (
                    <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                        <p className="text-4xl mb-2">📭</p>
                        <p className="text-gray-500">No patients yet.</p>
                        <p className="text-sm text-gray-400 mt-1">
                            Create a prescription to add patients.
                        </p>
                        <button onClick={() => navigate('/create-prescription')}
                            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 btn-press">
                            ➕ Create Prescription
                        </button>
                    </div>
                )}

                {/* ===== PATIENTS LIST ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {patients.map((patient) => (
                        <div key={patient.patientId}
                            className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition animate-slide-up">
                            
                            {/* Patient Header */}
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-gray-800">{patient.fullName}</h3>
                                    <p className="text-xs text-gray-500">{patient.patientId}</p>
                                </div>
                                {/* Blood Group Badge */}
                                {patient.bloodGroup && (
                                    <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">
                                        🩸 {patient.bloodGroup}
                                    </span>
                                )}
                            </div>

                            {/* Patient Info */}
                            <div className="space-y-1 text-sm mb-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">📱 Phone</span>
                                    <span className="text-gray-800">{patient.phone || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">📧 Email</span>
                                    <span className="text-gray-800 text-xs">{patient.email || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">🏙️ City</span>
                                    <span className="text-gray-800">{patient.city || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">📋 Prescriptions</span>
                                    <span className="font-medium text-indigo-600">{patient.prescriptionCount}</span>
                                </div>
                            </div>

                            {/* Allergies Warning */}
                            {patient.allergies && (
                                <div className="bg-yellow-50 p-2 rounded-lg mb-3">
                                    <p className="text-xs text-yellow-700">
                                        ⚠️ Allergies: {patient.allergies}
                                    </p>
                                </div>
                            )}

                            {/* Action Button */}
                            <button onClick={() => navigate(`/doctor/patient-report/${patient.patientId}`)}
                                className="w-full py-2 bg-green-50 text-green-700 text-sm font-medium rounded-lg hover:bg-green-100 transition btn-press">
                                📊 View Report
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default DoctorMyPatients