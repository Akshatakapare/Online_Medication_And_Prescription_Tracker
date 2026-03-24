import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAdminUserDetails, deleteUser } from '../api'

/**
 * ADMIN USER DETAILS PAGE
 * ========================
 * View complete details of any user
 */

function AdminUserDetails() {
    const navigate = useNavigate()
    const { id } = useParams()  // Get user ID from URL
    const adminUser = JSON.parse(localStorage.getItem('user'))

    const [userDetails, setUserDetails] = useState(null)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')

    // Check admin
    useEffect(() => {
        if (!adminUser || adminUser.role !== 'ADMIN') {
            navigate('/admin/login')
            return
        }
        fetchUserDetails()
    }, [id])

    // Fetch user details
    async function fetchUserDetails() {
        try {
            const data = await getAdminUserDetails(id)
            setUserDetails(data)
        } catch (error) {
            console.log('Error:', error)
        }
        setLoading(false)
    }

    // Delete user
    async function handleDelete() {
        if (!window.confirm(`Are you sure you want to delete ${userDetails.fullName}?`)) {
            return
        }

        try {
            const response = await deleteUser(id)
            setMessage(response)
            if (response.includes('successfully')) {
                setTimeout(() => navigate('/admin/dashboard'), 1500)
            }
        } catch (error) {
            setMessage('Error deleting user!')
        }
    }

    // Role colors
    const roleColors = {
        'PATIENT': 'bg-blue-100 text-blue-700',
        'DOCTOR': 'bg-green-100 text-green-700',
        'CAREGIVER': 'bg-purple-100 text-purple-700'
    }

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Navbar */}
            <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center sticky top-0 z-50">
                <h1 className="text-xl font-bold">💊 Prescripto Admin</h1>
                <button onClick={() => navigate(-1)}
                    className="text-gray-300 text-sm hover:text-white">
                    ← Back
                </button>
            </nav>

            <div className="p-6 max-w-3xl mx-auto animate-fade-in">

                {/* Loading */}
                {loading && <p className="text-center text-gray-500">Loading...</p>}

                {/* Error */}
                {userDetails?.error && (
                    <div className="bg-white p-8 rounded-xl text-center">
                        <p className="text-4xl mb-2">❌</p>
                        <p className="text-gray-500">{userDetails.error}</p>
                    </div>
                )}

                {/* Message */}
                {message && (
                    <div className={`p-3 rounded-lg mb-4 text-center text-sm ${
                        message.includes('successfully') 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                    }`}>
                        {message}
                    </div>
                )}

                {/* User Details */}
                {userDetails && !userDetails.error && (
                    <>
                        {/* Header Card */}
                        <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-2xl p-6 mb-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold">{userDetails.fullName}</h2>
                                    <p className="text-gray-300 mt-1">{userDetails.email}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${roleColors[userDetails.role]}`}>
                                    {userDetails.role}
                                </span>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                            {/* Basic Info */}
                            <div className="bg-white rounded-xl shadow-sm p-5">
                                <h3 className="font-bold text-gray-700 mb-3">📝 Basic Information</h3>
                                <InfoRow label="Full Name" value={userDetails.fullName} />
                                <InfoRow label="Email" value={userDetails.email} />
                                <InfoRow label="Phone" value={userDetails.phone} />
                                <InfoRow label="Gender" value={userDetails.gender} />
                                <InfoRow label="Date of Birth" value={userDetails.dateOfBirth} />
                            </div>

                            {/* Address */}
                            <div className="bg-white rounded-xl shadow-sm p-5">
                                <h3 className="font-bold text-gray-700 mb-3">📍 Address</h3>
                                <InfoRow label="Address" value={userDetails.address} />
                                <InfoRow label="City" value={userDetails.city} />
                                <InfoRow label="State" value={userDetails.state} />
                                <InfoRow label="Pincode" value={userDetails.pincode} />
                            </div>
                        </div>

                        {/* Role Specific Info */}
                        {userDetails.role === 'PATIENT' && (
                            <div className="bg-blue-50 rounded-xl shadow-sm p-5 mb-6">
                                <h3 className="font-bold text-blue-700 mb-3">🏥 Patient Information</h3>
                                <InfoRow label="Patient ID" value={userDetails.patientId} />
                                <InfoRow label="Blood Group" value={userDetails.bloodGroup} />
                                <InfoRow label="Allergies" value={userDetails.allergies} />
                                <InfoRow label="Emergency Contact" value={userDetails.emergencyContactName} />
                                <InfoRow label="Emergency Phone" value={userDetails.emergencyContactPhone} />
                            </div>
                        )}

                        {userDetails.role === 'DOCTOR' && (
                            <div className="bg-green-50 rounded-xl shadow-sm p-5 mb-6">
                                <h3 className="font-bold text-green-700 mb-3">👨‍⚕️ Doctor Information</h3>
                                <InfoRow label="Specialization" value={userDetails.specialization} />
                                <InfoRow label="Qualification" value={userDetails.qualification} />
                                <InfoRow label="Experience" value={userDetails.experienceYears ? `${userDetails.experienceYears} years` : null} />
                                <InfoRow label="License Number" value={userDetails.licenseNumber} />
                                <InfoRow label="Hospital" value={userDetails.hospitalName} />
                                <InfoRow label="Consultation Fee" value={userDetails.consultationFee ? `₹${userDetails.consultationFee}` : null} />
                            </div>
                        )}

                        {userDetails.role === 'CAREGIVER' && (
                            <div className="bg-purple-50 rounded-xl shadow-sm p-5 mb-6">
                                <h3 className="font-bold text-purple-700 mb-3">🤝 Caregiver Information</h3>
                                <InfoRow label="Relation with Patient" value={userDetails.relationWithPatient} />
                                <InfoRow label="Assigned Patient ID" value={userDetails.assignedPatientId} />
                            </div>
                        )}

                        {/* Delete Button */}
                        <div className="text-center">
                            <button onClick={handleDelete}
                                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                                🗑️ Delete This User
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

// Reusable info row
function InfoRow({ label, value }) {
    return (
        <div className="flex justify-between py-1.5 border-b border-gray-100 text-sm">
            <span className="text-gray-500">{label}</span>
            <span className="font-medium text-gray-800">{value || 'N/A'}</span>
        </div>
    )
}

export default AdminUserDetails