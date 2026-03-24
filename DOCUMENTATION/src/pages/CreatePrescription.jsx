import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPrescription, getPatientsDropdown, getMedicinesDropdown } from '../api'

/**
 * CREATE PRESCRIPTION PAGE
 * =========================
 * Doctor creates prescription with:
 * - Patient dropdown (from database)
 * - Medicine dropdown (from medicine_master)
 */

function CreatePrescription() {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))

    // Dropdown data
    const [patients, setPatients] = useState([])
    const [medicinesList, setMedicinesList] = useState([])

    // Form data
    const [selectedPatient, setSelectedPatient] = useState('')
    const [diagnosis, setDiagnosis] = useState('')
    const [notes, setNotes] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    // Medicines (multiple rows)
    const [medicines, setMedicines] = useState([
        { medicineId: '', name: '', dosage: '', timing: 'MORNING', durationDays: 7, instructions: '' }
    ])

    // Fetch dropdowns on load
    useEffect(() => {
        async function loadDropdowns() {
            try {
                const patientsData = await getPatientsDropdown()
                setPatients(patientsData)

                const medsData = await getMedicinesDropdown()
                setMedicinesList(medsData)
            } catch (error) {
                console.log('Error loading dropdowns:', error)
            }
        }
        loadDropdowns()
    }, [])

    // Add medicine row
    function addMedicine() {
        setMedicines([...medicines, 
            { medicineId: '', name: '', dosage: '', timing: 'MORNING', durationDays: 7, instructions: '' }
        ])
    }

    // Remove medicine row
    function removeMedicine(index) {
        setMedicines(medicines.filter((_, i) => i !== index))
    }

    // Update medicine field
    function updateMedicine(index, field, value) {
        const updated = [...medicines]
        updated[index][field] = value

        // Auto-fill dosage when medicine selected
        if (field === 'medicineId' && value) {
            const selected = medicinesList.find(m => m.id.toString() === value)
            if (selected) {
                updated[index].name = selected.name
                updated[index].dosage = selected.defaultDosage || ''
            }
        }

        setMedicines(updated)
    }

    // Submit
    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        const data = {
            doctorId: user.id,
            patientId: selectedPatient,
            diagnosis: diagnosis,
            notes: notes,
            medicines: medicines.map(med => ({
                name: med.name,
                dosage: med.dosage,
                timing: med.timing,
                durationDays: parseInt(med.durationDays),
                instructions: med.instructions
            }))
        }

        try {
            const response = await createPrescription(data)
            setMessage(response)
            if (response.includes('successful')) {
                setTimeout(() => navigate('/dashboard'), 1500)
            }
        } catch (error) {
            setMessage('Something went wrong!')
        }
        setLoading(false)
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

            <div className="p-6 max-w-3xl mx-auto animate-fade-in">

                <h2 className="text-2xl font-bold text-gray-800 mb-6">➕ Create Prescription</h2>

                {/* Message */}
                {message && (
                    <div className={`p-3 rounded-lg mb-4 text-center text-sm ${
                        message.includes('successful') 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                    }`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    {/* Prescription Details */}
                    <div className="bg-white p-5 rounded-xl shadow-sm mb-5">
                        <h3 className="font-bold text-gray-700 mb-3">📋 Prescription Details</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                            {/* Patient Dropdown */}
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                    Select Patient *
                                </label>
                                <select 
                                    value={selectedPatient} 
                                    onChange={(e) => setSelectedPatient(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-indigo-500"
                                >
                                    <option value="">-- Select Patient --</option>
                                    {patients.map((p) => (
                                        <option key={p.patientId} value={p.patientId}>
                                            {p.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Diagnosis */}
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                    Diagnosis *
                                </label>
                                <input 
                                    type="text" 
                                    value={diagnosis} 
                                    onChange={(e) => setDiagnosis(e.target.value)}
                                    required 
                                    placeholder="e.g., Viral Fever"
                                    className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-indigo-500" 
                                />
                            </div>

                            {/* Notes */}
                            <div className="md:col-span-2">
                                <label className="block text-xs text-gray-600 mb-1">
                                    Notes (Optional)
                                </label>
                                <input 
                                    type="text" 
                                    value={notes} 
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="e.g., Take rest, drink lots of water"
                                    className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-indigo-500" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Medicines */}
                    <div className="bg-white p-5 rounded-xl shadow-sm mb-5">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-gray-700">💊 Medicines</h3>
                            <button 
                                type="button" 
                                onClick={addMedicine}
                                className="text-sm px-3 py-1 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200"
                            >
                                + Add Medicine
                            </button>
                        </div>

                        {medicines.map((med, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3">
                                
                                {/* Header */}
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-600">
                                        Medicine #{index + 1}
                                    </span>
                                    {medicines.length > 1 && (
                                        <button 
                                            type="button" 
                                            onClick={() => removeMedicine(index)}
                                            className="text-red-500 text-xs hover:underline"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

                                    {/* Medicine Dropdown */}
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-xs text-gray-500 mb-1">
                                            Medicine *
                                        </label>
                                        <select 
                                            value={med.medicineId}
                                            onChange={(e) => updateMedicine(index, 'medicineId', e.target.value)}
                                            required
                                            className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-indigo-500"
                                        >
                                            <option value="">-- Select --</option>
                                            {medicinesList.map((m) => (
                                                <option key={m.id} value={m.id}>
                                                    {m.name} {m.isLowStock ? '⚠️' : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Dosage */}
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">
                                            Dosage
                                        </label>
                                        <input 
                                            type="text" 
                                            value={med.dosage}
                                            onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                                            placeholder="500mg"
                                            className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-indigo-500" 
                                        />
                                    </div>

                                    {/* Timing */}
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">
                                            Timing
                                        </label>
                                        <select 
                                            value={med.timing}
                                            onChange={(e) => updateMedicine(index, 'timing', e.target.value)}
                                            className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-indigo-500"
                                        >
                                            <option value="MORNING">🌅 Morning</option>
                                            <option value="EVENING">🌆 Evening</option>
                                            <option value="NIGHT">🌙 Night</option>
                                            <option value="MORNING_EVENING">🌅🌆 Morning & Evening</option>
                                            <option value="MORNING_NIGHT">🌅🌙 Morning & Night</option>
                                            <option value="EVENING_NIGHT">🌆🌙 Evening & Night</option>
                                            <option value="MORNING_EVENING_NIGHT">🌅🌆🌙 All Three</option>
                                        </select>
                                    </div>

                                    {/* Duration */}
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">
                                            Days
                                        </label>
                                        <input 
                                            type="number" 
                                            value={med.durationDays}
                                            onChange={(e) => updateMedicine(index, 'durationDays', e.target.value)}
                                            placeholder="7"
                                            min="1"
                                            className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-indigo-500" 
                                        />
                                    </div>

                                    {/* Instructions */}
                                    <div className="col-span-2">
                                        <label className="block text-xs text-gray-500 mb-1">
                                            Instructions
                                        </label>
                                        <input 
                                            type="text" 
                                            value={med.instructions}
                                            onChange={(e) => updateMedicine(index, 'instructions', e.target.value)}
                                            placeholder="After food, with warm water"
                                            className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-indigo-500" 
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Submit */}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400"
                    >
                        {loading ? '⏳ Creating...' : '📋 Create Prescription'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreatePrescription