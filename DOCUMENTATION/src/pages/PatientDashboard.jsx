import { useNavigate } from 'react-router-dom'

function PatientDashboard() {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))
    const patient = user.patientInfo

    function handleLogout() {
        localStorage.clear()
        navigate('/')
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Navbar */}
            <nav className="bg-white shadow-sm px-6 py-3 flex justify-between items-center sticky top-0 z-50">
                <h1 className="text-xl font-bold text-indigo-600">💊 Prescripto</h1>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">🏥 {user.fullName}</span>
                    <button onClick={handleLogout}
                        className="px-4 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition btn-press">
                        Logout
                    </button>
                </div>
            </nav>

            <div className="p-6 max-w-5xl mx-auto animate-fade-in">

                {/* Welcome */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl p-6 mb-6">
                    <h2 className="text-2xl font-bold">Welcome, {user.fullName}! 👋</h2>
                    <p className="text-blue-100 mt-1">Patient Dashboard • {patient?.patientId || 'N/A'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                    {/* Profile */}
                    <div className="bg-white rounded-xl shadow-sm p-5 animate-slide-up">
                        <h3 className="font-bold text-gray-700 mb-3">📝 Profile</h3>
                        <InfoRow label="Email" value={user.email} />
                        <InfoRow label="Phone" value={user.phone} />
                        <InfoRow label="Gender" value={user.gender} />
                        <InfoRow label="DOB" value={user.dateOfBirth} />
                        <InfoRow label="City" value={user.city} />
                    </div>

                    {/* Medical Info */}
                    <div className="bg-blue-50 rounded-xl shadow-sm p-5 animate-slide-up">
                        <h3 className="font-bold text-blue-700 mb-3">🏥 Medical Info</h3>
                        <InfoRow label="Patient ID" value={patient?.patientId} />
                        <InfoRow label="Blood Group" value={patient?.bloodGroup} />
                        <InfoRow label="Allergies" value={patient?.allergies} />
                        <InfoRow label="Emergency Contact" value={patient?.emergencyContactName} />
                        <InfoRow label="Emergency Phone" value={patient?.emergencyContactPhone} />
                    </div>
                </div>

                {/* Quick Actions - Replace the existing grid */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">

    <div onClick={() => navigate('/my-prescriptions')}
        className="p-4 rounded-xl text-center cursor-pointer bg-blue-50 hover:bg-blue-100 transition hover:-translate-y-1">
        <p className="text-2xl mb-1">📋</p>
        <p className="text-xs font-medium text-gray-700">My Prescriptions</p>
    </div>

    <div onClick={() => navigate('/today-schedule')}
        className="p-4 rounded-xl text-center cursor-pointer bg-green-50 hover:bg-green-100 transition hover:-translate-y-1">
        <p className="text-2xl mb-1">💊</p>
        <p className="text-xs font-medium text-gray-700">Today's Medicines</p>
    </div>

    {/* Health Report - NOW WORKING */}
    <div onClick={() => navigate('/health-report')}
        className="p-4 rounded-xl text-center cursor-pointer bg-purple-50 hover:bg-purple-100 transition hover:-translate-y-1">
        <p className="text-2xl mb-1">📊</p>
        <p className="text-xs font-medium text-gray-700">Health Report</p>
    </div>

    {/* Appointments - NOW WORKING */}
    <div onClick={() => navigate('/my-appointments')}
        className="p-4 rounded-xl text-center cursor-pointer bg-yellow-50 hover:bg-yellow-100 transition hover:-translate-y-1">
        <p className="text-2xl mb-1">📅</p>
        <p className="text-xs font-medium text-gray-700">Appointments</p>
    </div>
</div>
            </div>
        </div>
    )
}

function InfoRow({ label, value }) {
    return (
        <div className="flex justify-between py-1.5 border-b border-gray-100 text-sm">
            <span className="text-gray-500">{label}</span>
            <span className="font-medium text-gray-800">{value || 'N/A'}</span>
        </div>
    )
}

export default PatientDashboard