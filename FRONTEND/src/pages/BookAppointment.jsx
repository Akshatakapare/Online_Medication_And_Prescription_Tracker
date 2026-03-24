import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllDoctors, bookAppointment } from '../api'

/**
 * BOOK APPOINTMENT PAGE
 * ======================
 * Patient books appointment with a doctor
 */

function BookAppointment() {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))
    const patientId = user.patientInfo?.patientId

    const [doctors, setDoctors] = useState([])
    const [selectedDoctor, setSelectedDoctor] = useState('')
    const [appointmentDate, setAppointmentDate] = useState('')
    const [timeSlot, setTimeSlot] = useState('')
    const [reason, setReason] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    // Fetch doctors
    useEffect(() => {
        async function loadDoctors() {
            try {
                const data = await getAllDoctors()
                setDoctors(data)
            } catch (error) {
                console.log('Error:', error)
            }
        }
        loadDoctors()
    }, [])

    // Time slots
    const timeSlots = [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM',
        '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM'
    ]

    // Submit
    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            const response = await bookAppointment({
                doctorId: selectedDoctor,
                patientId: patientId,
                appointmentDate: appointmentDate,
                timeSlot: timeSlot,
                reason: reason
            })
            setMessage(response)
            if (response.includes('successfully')) {
                setTimeout(() => navigate('/my-appointments'), 1500)
            }
        } catch (error) {
            setMessage('Something went wrong!')
        }
        setLoading(false)
    }

    // Min date = today
    const today = new Date().toISOString().split('T')[0]

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Navbar */}
            <nav className="bg-white shadow-sm px-6 py-3 flex justify-between items-center sticky top-0 z-50">
                <h1 className="text-xl font-bold text-indigo-600">💊 Prescripto</h1>
                <button onClick={() => navigate('/dashboard')}
                    className="text-indigo-600 text-sm hover:underline">
                    ← Back
                </button>
            </nav>

            <div className="p-6 max-w-xl mx-auto animate-fade-in">

                <h2 className="text-2xl font-bold text-gray-800 mb-6">📅 Book Appointment</h2>

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

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm">

                    {/* Select Doctor */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Doctor *
                        </label>
                        <select 
                            value={selectedDoctor}
                            onChange={(e) => setSelectedDoctor(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                        >
                            <option value="">-- Choose Doctor --</option>
                            {doctors.map((doc) => (
                                <option key={doc.id} value={doc.id}>
                                    Dr. {doc.fullName} - {doc.doctorInfo?.specialization || 'General'}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Appointment Date *
                        </label>
                        <input 
                            type="date" 
                            value={appointmentDate}
                            onChange={(e) => setAppointmentDate(e.target.value)}
                            min={today}
                            required
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    {/* Time Slot */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Time Slot *
                        </label>
                        <select 
                            value={timeSlot}
                            onChange={(e) => setTimeSlot(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                        >
                            <option value="">-- Select Time --</option>
                            {timeSlots.map((slot) => (
                                <option key={slot} value={slot}>{slot}</option>
                            ))}
                        </select>
                    </div>

                    {/* Reason */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Reason for Visit
                        </label>
                        <textarea 
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g., Regular checkup, Fever since 2 days..."
                            rows="3"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    {/* Submit */}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400"
                    >
                        {loading ? '⏳ Booking...' : '📅 Book Appointment'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default BookAppointment