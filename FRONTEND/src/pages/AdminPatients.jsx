import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAdminPatients, deleteUser } from '../api'

/**
 * ADMIN PATIENTS PAGE
 * ====================
 * Admin can view and delete patients
 */

function AdminPatients() {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))

    const [patients, setPatients] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')

    // Check admin
    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            navigate('/admin/login')
            return
        }
        fetchPatients()
    }, [])

    // Fetch patients
    async function fetchPatients() {
        try {
            const data = await getAdminPatients()
            setPatients(data)
        } catch (error) {
            console.log('Error:', error)
        }
        setLoading(false)
    }

    // Delete patient
    async function handleDelete(id, name) {
        // Confirm delete
        if (!window.confirm(`Are you sure you want to delete ${name}?`)) {
            return
        }

        try {
            const response = await deleteUser(id)
            setMessage(response)
            // Refresh list
            fetchPatients()
        } catch (error) {
            setMessage('Error deleting user!')
        }
    }

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Navbar */}
            <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center sticky top-0 z-50">
                <h1 className="text-xl font-bold">💊 Prescripto Admin</h1>
                <button onClick={() => navigate('/admin/dashboard')}
                    className="text-gray-300 text-sm hover:text-white">
                    ← Back to Dashboard
                </button>
            </nav>

            <div className="p-6 max-w-6xl mx-auto animate-fade-in">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">🏥 All Patients</h2>
                    <span className="text-gray-500">{patients.length} patients</span>
                </div>

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

                {/* Loading */}
                {loading && <p className="text-center text-gray-500">Loading...</p>}

                {/* No patients */}
                {!loading && patients.length === 0 && (
                    <div className="bg-white p-8 rounded-xl text-center">
                        <p className="text-4xl mb-2">📭</p>
                        <p className="text-gray-500">No patients found</p>
                    </div>
                )}

                {/* Patients Table */}
                {patients.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="text-left p-4">Name</th>
                                        <th className="text-left p-4">Patient ID</th>
                                        <th className="text-left p-4">Email</th>
                                        <th className="text-left p-4">Phone</th>
                                        <th className="text-left p-4">Blood Group</th>
                                        <th className="text-center p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {patients.map((patient) => (
                                        <tr key={patient.id} className="border-b hover:bg-gray-50">
                                            <td className="p-4 font-medium">{patient.fullName}</td>
                                            <td className="p-4 text-blue-600">{patient.patientId || '-'}</td>
                                            <td className="p-4 text-gray-600">{patient.email}</td>
                                            <td className="p-4">{patient.phone || '-'}</td>
                                            <td className="p-4">{patient.bloodGroup || '-'}</td>
                                            <td className="p-4 text-center">
                                                <div className="flex gap-2 justify-center">
                                                    {/* View Details */}
                                                    <button onClick={() => navigate(`/admin/user/${patient.id}`)}
                                                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs hover:bg-blue-200">
                                                        👁️ View
                                                    </button>
                                                    {/* Delete */}
                                                    <button onClick={() => handleDelete(patient.id, patient.fullName)}
                                                        className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs hover:bg-red-200">
                                                        🗑️ Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminPatients