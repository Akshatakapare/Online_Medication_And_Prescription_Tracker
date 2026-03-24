import { useNavigate } from 'react-router-dom'

function DoctorDashboard() {
    const navigate = useNavigate()
    
    // LocalStorage se logged in user ka data lo
    const user = JSON.parse(localStorage.getItem('user'))
    const doctor = user.doctorInfo

    // Logout function - localStorage clear karke home pe bhejo
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
                    <span className="text-sm text-gray-600">👨‍⚕️ Dr. {user.fullName}</span>
                    <button onClick={handleLogout}
                        className="px-4 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition btn-press">
                        Logout
                    </button>
                </div>
            </nav>

            <div className="p-6 max-w-5xl mx-auto animate-fade-in">

                {/* ===== WELCOME CARD ===== */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-6 mb-6">
                    <h2 className="text-2xl font-bold">Welcome, Dr. {user.fullName}! 👋</h2>
                    <p className="text-green-100 mt-1">
                        {doctor?.specialization || 'Doctor'} • {doctor?.hospitalName || 'N/A'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                    {/* ===== PROFILE CARD ===== */}
                    <div className="bg-white rounded-xl shadow-sm p-5 animate-slide-up">
                        <h3 className="font-bold text-gray-700 mb-3">📝 Profile</h3>
                        <InfoRow label="Email" value={user.email} />
                        <InfoRow label="Phone" value={user.phone} />
                        <InfoRow label="Gender" value={user.gender} />
                        <InfoRow label="City" value={user.city} />
                    </div>

                    {/* ===== PROFESSIONAL INFO CARD ===== */}
                    <div className="bg-green-50 rounded-xl shadow-sm p-5 animate-slide-up">
                        <h3 className="font-bold text-green-700 mb-3">👨‍⚕️ Professional</h3>
                        <InfoRow label="Specialization" value={doctor?.specialization} />
                        <InfoRow label="Qualification" value={doctor?.qualification} />
                        <InfoRow label="Experience" value={doctor?.experienceYears ? `${doctor.experienceYears} years` : null} />
                        <InfoRow label="License No." value={doctor?.licenseNumber} />
                        <InfoRow label="Hospital" value={doctor?.hospitalName} />
                        <InfoRow label="Fee" value={doctor?.consultationFee ? `₹${doctor.consultationFee}` : null} />
                    </div>
                </div>

                {/* ===== QUICK ACTIONS ===== */}
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <h3 className="font-bold text-gray-700 mb-4">⚡ Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                        {/* New Prescription - Navigate to create page */}
                        <div onClick={() => navigate('/create-prescription')}
                            className="p-4 rounded-xl text-center cursor-pointer bg-blue-50 hover:bg-blue-100 transition hover:-translate-y-1">
                            <p className="text-2xl mb-1">➕</p>
                            <p className="text-xs font-medium text-gray-700">New Prescription</p>
                        </div>

                        {/* ===== MY PATIENTS - NOW CLICKABLE ===== */}
                        <div onClick={() => navigate('/doctor/my-patients')}
                            className="p-4 rounded-xl text-center cursor-pointer bg-green-50 hover:bg-green-100 transition hover:-translate-y-1">
                            <p className="text-2xl mb-1">👥</p>
                            <p className="text-xs font-medium text-gray-700">My Patients</p>
                        </div>

                        {/* Patient Reports - Goes to My Patients first */}
                        <div onClick={() => navigate('/doctor/my-patients')}
                            className="p-4 rounded-xl text-center cursor-pointer bg-yellow-50 hover:bg-yellow-100 transition hover:-translate-y-1">
                            <p className="text-2xl mb-1">📊</p>
                            <p className="text-xs font-medium text-gray-700">Patient Reports</p>
                        </div>

                        {/* Appointments - NOW WORKING */}
<div onClick={() => navigate('/doctor/appointments')}
    className="p-4 rounded-xl text-center cursor-pointer bg-purple-50 hover:bg-purple-100 transition hover:-translate-y-1">
    <p className="text-2xl mb-1">📅</p>
    <p className="text-xs font-medium text-gray-700">Appointments</p>
</div>

                    </div>
                </div>
            </div>
        </div>
    )
}

// ===== REUSABLE COMPONENT =====
// Profile info row - left pe label, right pe value
function InfoRow({ label, value }) {
    return (
        <div className="flex justify-between py-1.5 border-b border-gray-100 text-sm">
            <span className="text-gray-500">{label}</span>
            <span className="font-medium text-gray-800">{value || 'N/A'}</span>
        </div>
    )
}

export default DoctorDashboard