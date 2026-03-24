import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTodaySchedule, markDose, getAdherenceStats } from '../api'

function TodaySchedule() {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))
    const patientId = user.patientInfo?.patientId

    const [schedule, setSchedule] = useState(null)
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    async function fetchData() {
        try {
            const scheduleData = await getTodaySchedule(patientId)
            setSchedule(scheduleData)
            const statsData = await getAdherenceStats(patientId)
            setStats(statsData)
        } catch (error) {
            console.log('Error')
        }
        setLoading(false)
    }

    useEffect(() => {
        if (patientId) fetchData()
    }, [patientId])

    // Mark as taken or missed
    async function handleMark(medicineId, timing, status) {
        try {
            await markDose({
                medicineId: medicineId,
                patientId: patientId,
                date: schedule.date,
                timing: timing,
                status: status
            })
            // Refresh data
            fetchData()
        } catch (error) {
            console.log('Error marking dose')
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">

            <nav className="bg-white shadow-sm px-6 py-3 flex justify-between items-center sticky top-0 z-50">
                <h1 className="text-xl font-bold text-indigo-600">💊 Prescripto</h1>
                <button onClick={() => navigate('/dashboard')}
                    className="text-indigo-600 text-sm hover:underline">← Dashboard</button>
            </nav>

            <div className="p-6 max-w-3xl mx-auto animate-fade-in">

                <h2 className="text-2xl font-bold text-gray-800 mb-2">💊 Today's Schedule</h2>
                <p className="text-sm text-gray-500 mb-6">📅 {schedule?.date || 'Loading...'}</p>

                {/* Adherence Stats */}
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

                {loading && <p className="text-gray-500">Loading...</p>}

                {/* Morning */}
                {schedule && <TimeSlot title="🌅 Morning" medicines={schedule.morning} timing="MORNING" onMark={handleMark} />}

                {/* Evening */}
                {schedule && <TimeSlot title="🌆 Evening" medicines={schedule.evening} timing="EVENING" onMark={handleMark} />}

                {/* Night */}
                {schedule && <TimeSlot title="🌙 Night" medicines={schedule.night} timing="NIGHT" onMark={handleMark} />}

                {/* No medicines */}
                {schedule && schedule.morning.length === 0 && schedule.evening.length === 0 && schedule.night.length === 0 && (
                    <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                        <p className="text-4xl mb-2">🎉</p>
                        <p className="text-gray-500">No medicines scheduled for today!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

// Time Slot Component
function TimeSlot({ title, medicines, timing, onMark }) {
    if (medicines.length === 0) return null

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm mb-4 animate-slide-up">
            <h3 className="font-bold text-gray-700 mb-3">{title}</h3>

            {medicines.map((med) => (
                <div key={med.medicineId + timing} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg mb-2">

                    {/* Medicine Info */}
                    <div>
                        <p className="font-medium text-sm">💊 {med.name}</p>
                        <p className="text-xs text-gray-500">{med.dosage} • {med.instructions}</p>
                    </div>

                    {/* Status / Buttons */}
                    <div>
                        {med.status === 'TAKEN' && (
                            <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-lg">✅ Taken</span>
                        )}
                        {med.status === 'MISSED' && (
                            <span className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-lg">❌ Missed</span>
                        )}
                        {med.status === 'PENDING' && (
                            <div className="flex gap-2">
                                <button onClick={() => onMark(med.medicineId, timing, 'TAKEN')}
                                    className="text-xs px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 btn-press">
                                    ✅ Taken
                                </button>
                                <button onClick={() => onMark(med.medicineId, timing, 'MISSED')}
                                    className="text-xs px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 btn-press">
                                    ❌ Missed
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default TodaySchedule