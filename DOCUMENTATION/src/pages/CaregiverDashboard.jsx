import { useNavigate } from 'react-router-dom'

/**
 * CAREGIVER DASHBOARD
 * ====================
 * Shows caregiver profile and linked patient info
 * Quick actions to view patient details, medicines, prescriptions
 */

function CaregiverDashboard() {
    const navigate = useNavigate()
    
    // Get logged in user from localStorage
    const user = JSON.parse(localStorage.getItem('user'))
    const caregiver = user.caregiverInfo
    const linkedPatient = user.linkedPatient

    // Logout function
    function handleLogout() {
        localStorage.clear()
        navigate('/')
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ===== NAVBAR ===== */}
            <nav className="bg-white shadow-sm px-6 py-3 flex justify-between items-center sticky top-0 z-50">
                <h1 className="text-xl font-bold text-indigo-600">💊 Prescripto</h1>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">🤝 {user.fullName}</span>
                    <button onClick={handleLogout}
                        className="px-4 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition btn-press">
                        Logout
                    </button>
                </div>
            </nav>

            <div className="p-6 max-w-5xl mx-auto animate-fade-in">

                {/* ===== WELCOME CARD ===== */}
                <div className="bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-2xl p-6 mb-6">
                    <h2 className="text-2xl font-bold">Welcome, {user.fullName}! 👋</h2>
                    <p className="text-purple-100 mt-1">
                        Caregiver • {caregiver?.relationWithPatient || 'N/A'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                    {/* ===== PROFILE CARD ===== */}
                    <div className="bg-white rounded-xl shadow-sm p-5 animate-slide-up">
                        <h3 className="font-bold text-gray-700 mb-3">📝 My Profile</h3>
                        <InfoRow label="Email" value={user.email} />
                        <InfoRow label="Phone" value={user.phone} />
                        <InfoRow label="City" value={user.city} />
                        <InfoRow label="Relation" value={caregiver?.relationWithPatient} />
                        <InfoRow label="Assigned Patient" value={caregiver?.assignedPatientId} />
                    </div>

                    {/* ===== LINKED PATIENT CARD ===== */}
                    <div className="bg-purple-50 rounded-xl shadow-sm p-5 animate-slide-up">
                        <h3 className="font-bold text-purple-700 mb-3">👤 My Patient</h3>
                        {linkedPatient ? (
                            <>
                                <InfoRow label="Name" value={linkedPatient.fullName} />
                                <InfoRow label="Phone" value={linkedPatient.phone} />
                                <InfoRow label="Patient ID" value={linkedPatient.patientId} />
                                <InfoRow label="Blood Group" value={linkedPatient.bloodGroup} />
                            </>
                        ) : (
                            <p className="text-gray-500 text-sm">No patient linked yet.</p>
                        )}
                    </div>
                </div>

                {/* ===== QUICK ACTIONS ===== */}
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <h3 className="font-bold text-gray-700 mb-4">⚡ Quick Actions</h3>
                    
                    {/* Check if patient is linked */}
                    {!linkedPatient || !caregiver?.assignedPatientId ? (
                        <div className="text-center py-6">
                            <p className="text-gray-500">⚠️ No patient linked to your account.</p>
                            <p className="text-sm text-gray-400 mt-1">
                                Please contact admin to link a patient.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                            {/* ===== PATIENT DETAILS - NOW CLICKABLE ===== */}
                            <div onClick={() => navigate('/caregiver/patient-details')}
                                className="p-4 rounded-xl text-center cursor-pointer bg-blue-50 hover:bg-blue-100 transition hover:-translate-y-1">
                                <p className="text-2xl mb-1">👤</p>
                                <p className="text-xs font-medium text-gray-700">Patient Details</p>
                            </div>

                            {/* ===== MEDICINE STATUS - NOW CLICKABLE ===== */}
                            <div onClick={() => navigate('/caregiver/medicine-status')}
                                className="p-4 rounded-xl text-center cursor-pointer bg-green-50 hover:bg-green-100 transition hover:-translate-y-1">
                                <p className="text-2xl mb-1">💊</p>
                                <p className="text-xs font-medium text-gray-700">Medicine Status</p>
                            </div>

                            {/* ===== PRESCRIPTIONS - NOW CLICKABLE ===== */}
                            <div onClick={() => navigate('/caregiver/prescriptions')}
                                className="p-4 rounded-xl text-center cursor-pointer bg-yellow-50 hover:bg-yellow-100 transition hover:-translate-y-1">
                                <p className="text-2xl mb-1">📋</p>
                                <p className="text-xs font-medium text-gray-700">Prescriptions</p>
                            </div>

                           {/* Contact Doctor - NOW WORKING */}
<div onClick={() => alert('📞 Contact your patient\'s doctor through the Prescriptions page. Doctor contact details are shown on each prescription.')}
    className="p-4 rounded-xl text-center cursor-pointer bg-purple-50 hover:bg-purple-100 transition hover:-translate-y-1">
    <p className="text-2xl mb-1">📞</p>
    <p className="text-xs font-medium text-gray-700">Contact Doctor</p>
</div>
                        </div>
                    )}
                </div>
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

export default CaregiverDashboard