import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDoctorAppointments, getPatientAppointments, updateAppointmentStatus } from '../api'

/**
 * APPOINTMENTS PAGE
 * ==================
 * Shows appointments for both Doctor and Patient
 */

function Appointments() {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))
    const isDoctor = user.role === 'DOCTOR'
    const isPatient = user.role === 'PATIENT'

    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAppointments()
    }, [])

    async function fetchAppointments() {
        try {
            let data
            if (isDoctor) {
                data = await getDoctorAppointments(user.id)
            } else {
                data = await getPatientAppointments(user.patientInfo?.patientId)
            }
            setAppointments(data)
        } catch (error) {
            console.log('Error:', error)
        }
        setLoading(false)
    }

    // Doctor updates status
    async function handleStatusUpdate(id, newStatus) {
        try {
            await updateAppointmentStatus(id, newStatus)
            fetchAppointments() // Refresh
        } catch (error) {
            console.log('Error:', error)
        }
    }

    // Status badge colors
    const statusColors = {
        'PENDING': 'bg-yellow-100 text-yellow-700',
        'CONFIRMED': 'bg-green-100 text-green-700',
        'COMPLETED': 'bg-blue-100 text-blue-700',
        'CANCELLED': 'bg-red-100 text-red-700'
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

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">📅 Appointments</h2>
                    {isPatient && (
                        <button onClick={() => navigate('/book-appointment')}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                            + Book Appointment
                        </button>
                    )}
                </div>

                {loading && <p className="text-gray-500 text-center">Loading...</p>}

                {!loading && appointments.length === 0 && (
                    <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                        <p className="text-4xl mb-2">📭</p>
                        <p className="text-gray-500">No appointments yet</p>
                        {isPatient && (
                            <button onClick={() => navigate('/book-appointment')}
                                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg">
                                Book Your First Appointment
                            </button>
                        )}
                    </div>
                )}

                {/* Appointments List */}
                <div className="space-y-4">
                    {appointments.map((apt) => (
                        <div key={apt.id} className="bg-white p-5 rounded-xl shadow-sm">
                            
                            {/* Header */}
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="font-bold text-gray-800">
                                        {isDoctor ? `👤 ${apt.patientName}` : `👨‍⚕️ Dr. ${apt.doctorName}`}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        📅 {apt.appointmentDate} • ⏰ {apt.timeSlot}
                                    </p>
                                    {isPatient && apt.specialization && (
                                        <p className="text-xs text-indigo-600">{apt.specialization}</p>
                                    )}
                                </div>
                                <span className={`px-3 py-1 rounded-lg text-xs font-medium ${statusColors[apt.status]}`}>
                                    {apt.status}
                                </span>
                            </div>

                            {/* Reason */}
                            {apt.reason && (
                                <p className="text-sm text-gray-600 mb-3">
                                    📝 <strong>Reason:</strong> {apt.reason}
                                </p>
                            )}

                            {/* Doctor Notes */}
                            {apt.doctorNotes && (
                                <p className="text-sm text-gray-600 mb-3">
                                    💬 <strong>Doctor Notes:</strong> {apt.doctorNotes}
                                </p>
                            )}

                            {/* Doctor Actions */}
                            {isDoctor && apt.status === 'PENDING' && (
                                <div className="flex gap-2 mt-3 pt-3 border-t">
                                    <button onClick={() => handleStatusUpdate(apt.id, 'CONFIRMED')}
                                        className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200">
                                        ✅ Confirm
                                    </button>
                                    <button onClick={() => handleStatusUpdate(apt.id, 'CANCELLED')}
                                        className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200">
                                        ❌ Cancel
                                    </button>
                                </div>
                            )}

                            {isDoctor && apt.status === 'CONFIRMED' && (
                                <div className="mt-3 pt-3 border-t">
                                    <button onClick={() => handleStatusUpdate(apt.id, 'COMPLETED')}
                                        className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200">
                                        ✅ Mark Completed
                                    </button>
                                </div>
                            )}

                            {/* Contact Info */}
                            {isDoctor && apt.patientPhone && (
                                <p className="text-xs text-gray-400 mt-2">📱 {apt.patientPhone}</p>
                            )}
                            {isPatient && apt.doctorPhone && (
                                <p className="text-xs text-gray-400 mt-2">📱 {apt.doctorPhone}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Appointments