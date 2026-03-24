import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPatientPrescriptions } from '../api'

function MyPrescriptions() {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))
    const patientId = user.patientInfo?.patientId

    const [prescriptions, setPrescriptions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getPatientPrescriptions(patientId)
                setPrescriptions(data)
            } catch (error) {
                console.log('Error fetching prescriptions')
            }
            setLoading(false)
        }
        if (patientId) fetchData()
    }, [patientId])

    return (
        <div className="min-h-screen bg-gray-50">

            <nav className="bg-white shadow-sm px-6 py-3 flex justify-between items-center sticky top-0 z-50">
                <h1 className="text-xl font-bold text-indigo-600">💊 Prescripto</h1>
                <button onClick={() => navigate('/dashboard')}
                    className="text-indigo-600 text-sm hover:underline">← Dashboard</button>
            </nav>

            <div className="p-6 max-w-3xl mx-auto animate-fade-in">

                <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 My Prescriptions</h2>

                {loading && <p className="text-gray-500">Loading...</p>}

                {!loading && prescriptions.length === 0 && (
                    <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                        <p className="text-4xl mb-2">📭</p>
                        <p className="text-gray-500">No prescriptions yet.</p>
                    </div>
                )}

                {prescriptions.map((p) => (
                    <div key={p.id} className="bg-white p-5 rounded-xl shadow-sm mb-4 animate-slide-up">

                        {/* Header */}
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-gray-800">{p.diagnosis}</h3>
                                <p className="text-xs text-gray-500">By Dr. {p.doctorName} • {p.createdDate}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded ${
                                p.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                            }`}>{p.status}</span>
                        </div>

                        {/* Notes */}
                        {p.notes && <p className="text-sm text-gray-600 mb-3">📝 {p.notes}</p>}

                        {/* Medicines */}
                        <div className="space-y-2">
                            {p.medicines && p.medicines.map((med) => (
                                <div key={med.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-sm text-gray-800">💊 {med.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {med.dosage} • {med.timing.replace(/_/g, ' & ')} • {med.durationDays} days
                                        </p>
                                    </div>
                                    <span className="text-xs text-gray-400">{med.instructions}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyPrescriptions