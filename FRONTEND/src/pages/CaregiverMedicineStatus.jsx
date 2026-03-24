import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTodaySchedule, getAdherenceStats } from '../api'

/**
 * CAREGIVER MEDICINE STATUS PAGE
 * ================================
 * Shows today's medicine schedule of the linked patient
 * Caregiver can see which medicines are taken/missed/pending
 * NOTE: Caregiver can only VIEW, not mark doses (patient does that)
 */

function CaregiverMedicineStatus() {
    const navigate = useNavigate()
    
    // Get logged in caregiver from localStorage
    const user = JSON.parse(localStorage.getItem('user'))
    const linkedPatientId = user.caregiverInfo?.assignedPatientId
    const linkedPatient = user.linkedPatient
    
    // State variables
    const [schedule, setSchedule] = useState(null)
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    // Fetch data when page loads
    useEffect(() => {
        async function fetchData() {
            try {
                // Get today's schedule
                const scheduleData = await getTodaySchedule(linkedPatientId)
                setSchedule(scheduleData)
                
                // Get adherence stats
                const statsData = await getAdherenceStats(linkedPatientId)
                setStats(statsData)
            } catch (error) {
                console.log('Error fetching schedule:', error)
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

            <div className="p-6 max-w-3xl mx-auto animate-fade-in">

                {/* ===== PAGE TITLE ===== */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">💊 Medicine Status</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Patient: {linkedPatient?.fullName || linkedPatientId}
                    </p>
                    <p className="text-sm text-gray-400">📅 {schedule?.date || 'Loading...'}</p>
                </div>

                {/* ===== ADHERENCE STATS ===== */}
                {stats && (
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-green-50 p-4 rounded-xl text-center">
                            <p className="text-2xl font-bold text-green-600">{stats.taken}</p>
                            <p className="text-xs text-green-700">✅ Taken</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-xl text-center">
                            <p className="text-2xl font-bold text-red-600">{stats.missed}</p>
                            <p className="text-xs text-red-700">❌ Missed</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-xl text-center">
                            <p className="text-2xl font-bold text-blue-600">{stats.adherencePercentage}%</p>
                            <p className="text-xs text-blue-700">📊 Adherence</p>
                        </div>
                    </div>
                )}

                {/* ===== LOADING STATE ===== */}
                {loading && (
                    <div className="text-center py-10">
                        <p className="text-gray-500">⏳ Loading schedule...</p>
                    </div>
                )}

                {/* ===== MORNING MEDICINES ===== */}
                {schedule && schedule.morning.length > 0 && (
                    <TimeSlot title="🌅 Morning" medicines={schedule.morning} />
                )}

                {/* ===== EVENING MEDICINES ===== */}
                {schedule && schedule.evening.length > 0 && (
                    <TimeSlot title="🌆 Evening" medicines={schedule.evening} />
                )}

                {/* ===== NIGHT MEDICINES ===== */}
                {schedule && schedule.night.length > 0 && (
                    <TimeSlot title="🌙 Night" medicines={schedule.night} />
                )}

                {/* ===== NO MEDICINES ===== */}
                {schedule && 
                 schedule.morning.length === 0 && 
                 schedule.evening.length === 0 && 
                 schedule.night.length === 0 && (
                    <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                        <p className="text-4xl mb-2">🎉</p>
                        <p className="text-gray-500">No medicines scheduled for today!</p>
                    </div>
                )}

                {/* ===== INFO NOTE ===== */}
                <div className="mt-6 p-4 bg-yellow-50 rounded-xl">
                    <p className="text-sm text-yellow-700">
                        ℹ️ <strong>Note:</strong> Only the patient can mark medicines as taken or missed.
                        You are viewing the current status.
                    </p>
                </div>
            </div>
        </div>
    )
}

/**
 * TIME SLOT COMPONENT
 * Shows medicines for a specific time (morning/evening/night)
 */
function TimeSlot({ title, medicines }) {
    return (
        <div className="bg-white p-5 rounded-xl shadow-sm mb-4 animate-slide-up">
            <h3 className="font-bold text-gray-700 mb-3">{title}</h3>
            
            {medicines.map((med, index) => (
                <div key={index} 
                    className="flex justify-between items-center bg-gray-50 p-3 rounded-lg mb-2">
                    
                    {/* Medicine Info */}
                    <div>
                        <p className="font-medium text-sm">💊 {med.name}</p>
                        <p className="text-xs text-gray-500">{med.dosage} • {med.instructions}</p>
                    </div>
                    
                    {/* Status Badge */}
                    <span className={`text-xs px-3 py-1 rounded-lg ${
                        med.status === 'TAKEN' ? 'bg-green-100 text-green-700' :
                        med.status === 'MISSED' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                    }`}>
                        {med.status === 'TAKEN' ? '✅ Taken' :
                         med.status === 'MISSED' ? '❌ Missed' : '⏳ Pending'}
                    </span>
                </div>
            ))}
        </div>
    )
}

export default CaregiverMedicineStatus