import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../api'

function Register() {
    const navigate = useNavigate()

    // Common
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('PATIENT')
    const [phone, setPhone] = useState('')
    const [gender, setGender] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [pincode, setPincode] = useState('')

    // Patient
    const [patientId, setPatientId] = useState('')
    const [bloodGroup, setBloodGroup] = useState('')
    const [allergies, setAllergies] = useState('')
    const [emergencyContactName, setEmergencyContactName] = useState('')
    const [emergencyContactPhone, setEmergencyContactPhone] = useState('')

    // Doctor
    const [specialization, setSpecialization] = useState('')
    const [qualification, setQualification] = useState('')
    const [experienceYears, setExperienceYears] = useState('')
    const [licenseNumber, setLicenseNumber] = useState('')
    const [hospitalName, setHospitalName] = useState('')
    const [consultationFee, setConsultationFee] = useState('')

    // Caregiver
    const [relationWithPatient, setRelationWithPatient] = useState('')
    const [assignedPatientId, setAssignedPatientId] = useState('')

    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    // Auto-generate Patient ID
    useEffect(() => {
        if (role === 'PATIENT') {
            setPatientId('PAT-' + Math.random().toString(36).substr(2, 8).toUpperCase())
        }
    }, [role])

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)

        const userData = {
            fullName, email, password, role, phone, gender, dateOfBirth,
            address, city, state, pincode,
            patientId: role === 'PATIENT' ? patientId : null,
            bloodGroup, allergies, emergencyContactName, emergencyContactPhone,
            specialization, qualification,
            experienceYears: experienceYears ? parseInt(experienceYears) : null,
            licenseNumber, hospitalName,
            consultationFee: consultationFee ? parseFloat(consultationFee) : null,
            relationWithPatient,
            assignedPatientId: role === 'CAREGIVER' ? assignedPatientId : null
        }

        try {
            const response = await registerUser(userData)
            setMessage(response)
            if (response === 'Registration successful!') {
                setTimeout(() => navigate('/login'), 1500)
            }
        } catch (error) {
            setMessage('Something went wrong!')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">

            <div className="px-8 mb-4">
                <button onClick={() => navigate('/')}
                    className="text-indigo-600 hover:text-indigo-800 text-sm">
                    ← Back to Home
                </button>
            </div>

            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 animate-fade-in">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Create Account ✨</h1>
                    <p className="text-gray-500 mt-2">Join Prescripto today</p>
                </div>

                {message && (
                    <div className={`p-3 rounded-lg mb-6 text-center text-sm animate-fade-in ${
                        message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>{message}</div>
                )}

                <form onSubmit={handleSubmit}>

                    {/* Role Selection */}
                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2">I am a</label>
                        <div className="flex gap-3">
                            <RoleBtn label="🏥 Patient" value="PATIENT" current={role} onClick={setRole} />
                            <RoleBtn label="👨‍⚕️ Doctor" value="DOCTOR" current={role} onClick={setRole} />
                            <RoleBtn label="🤝 Caregiver" value="CAREGIVER" current={role} onClick={setRole} />
                        </div>
                    </div>

                    {/* Basic Info */}
                    <Section title="📝 Basic Information">
                        <Input label="Full Name *" type="text" value={fullName} onChange={setFullName} required placeholder="John Doe" />
                        <Input label="📧 Email *" type="email" value={email} onChange={setEmail} required placeholder="john@example.com" />
                        <Input label="🔒 Password *" type="password" value={password} onChange={setPassword} required placeholder="••••••••" />
                        <Input label="📱 Phone *" type="text" value={phone} onChange={setPhone} required placeholder="9876543210" />
                        <Select label="Gender" value={gender} onChange={setGender}
                            options={['Male', 'Female', 'Other']} />
                        <Input label="🎂 Date of Birth" type="date" value={dateOfBirth} onChange={setDateOfBirth} />
                    </Section>

                    {/* Address */}
                    <Section title="📍 Address">
                        <InputFull label="Address" value={address} onChange={setAddress} placeholder="123, MG Road" />
                        <Input label="City" type="text" value={city} onChange={setCity} placeholder="Mumbai" />
                        <Input label="State" type="text" value={state} onChange={setState} placeholder="Maharashtra" />
                        <Input label="Pincode" type="text" value={pincode} onChange={setPincode} placeholder="400001" />
                    </Section>

                    {/* Patient Fields */}
                    {role === 'PATIENT' && (
                        <Section title="🏥 Medical Information" bg="bg-blue-50">
                            <InputReadonly label="Patient ID" value={patientId} />
                            <Select label="🩸 Blood Group" value={bloodGroup} onChange={setBloodGroup}
                                options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']} />
                            <Input label="⚠️ Allergies" type="text" value={allergies} onChange={setAllergies} placeholder="Penicillin, Peanuts" />
                            <Input label="Emergency Contact" type="text" value={emergencyContactName} onChange={setEmergencyContactName} placeholder="Father's Name" />
                            <Input label="Emergency Phone" type="text" value={emergencyContactPhone} onChange={setEmergencyContactPhone} placeholder="9876543211" />
                        </Section>
                    )}

                    {/* Doctor Fields */}
                    {role === 'DOCTOR' && (
                        <Section title="👨‍⚕️ Professional Information" bg="bg-green-50">
                            <Select label="🏥 Specialization *" value={specialization} onChange={setSpecialization} required
                                options={['General Physician', 'Cardiologist', 'Dermatologist', 'Neurologist', 'Orthopedic', 'Pediatrician', 'Psychiatrist', 'Dentist', 'Other']} />
                            <Input label="🎓 Qualification *" type="text" value={qualification} onChange={setQualification} required placeholder="MBBS, MD" />
                            <Input label="📅 Experience (Years)" type="number" value={experienceYears} onChange={setExperienceYears} placeholder="10" />
                            <Input label="📄 License Number *" type="text" value={licenseNumber} onChange={setLicenseNumber} required placeholder="MCI-12345" />
                            <Input label="🏢 Hospital Name" type="text" value={hospitalName} onChange={setHospitalName} placeholder="City Hospital" />
                            <Input label="💰 Fee (₹)" type="number" value={consultationFee} onChange={setConsultationFee} placeholder="500" />
                        </Section>
                    )}

                    {/* Caregiver Fields */}
                    {role === 'CAREGIVER' && (
                        <Section title="🤝 Caregiver Information" bg="bg-purple-50">
                            <Select label="Relation with Patient *" value={relationWithPatient} onChange={setRelationWithPatient} required
                                options={['Son', 'Daughter', 'Spouse', 'Parent', 'Sibling', 'Nurse', 'Other']} />
                            <Input label="🔗 Assigned Patient ID *" type="text" value={assignedPatientId} onChange={setAssignedPatientId} required placeholder="PAT-XXXXXXXX" />
                        </Section>
                    )}

                    <button type="submit" disabled={loading}
                        className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition btn-press disabled:bg-indigo-400">
                        {loading ? '⏳ Creating Account...' : '🚀 Create Account'}
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-600 text-sm">
                    Already have an account?{' '}
                    <span onClick={() => navigate('/login')} className="text-indigo-600 font-medium cursor-pointer hover:underline">
                        Login here
                    </span>
                </p>
            </div>
        </div>
    )
}

// ===== REUSABLE COMPONENTS =====

function RoleBtn({ label, value, current, onClick }) {
    return (
        <button type="button" onClick={() => onClick(value)}
            className={`flex-1 py-3 rounded-lg border-2 transition text-sm btn-press ${
                current === value
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-600 font-medium'
                    : 'border-gray-300 text-gray-600 hover:border-indigo-300'
            }`}>
            {label}
        </button>
    )
}

function Section({ title, bg = 'bg-gray-50', children }) {
    return (
        <div className={`${bg} p-5 rounded-xl mb-5`}>
            <h3 className="text-sm font-bold text-gray-700 mb-3">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>
        </div>
    )
}

function Input({ label, type, value, onChange, required, placeholder }) {
    return (
        <div>
            <label className="block text-gray-600 text-xs mb-1">{label}</label>
            <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
                required={required} placeholder={placeholder}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition" />
        </div>
    )
}

function InputFull({ label, value, onChange, placeholder }) {
    return (
        <div className="md:col-span-2">
            <label className="block text-gray-600 text-xs mb-1">{label}</label>
            <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition" />
        </div>
    )
}

function InputReadonly({ label, value }) {
    return (
        <div>
            <label className="block text-gray-600 text-xs mb-1">{label}</label>
            <input type="text" value={value} readOnly
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" />
        </div>
    )
}

function Select({ label, value, onChange, options, required }) {
    return (
        <div>
            <label className="block text-gray-600 text-xs mb-1">{label}</label>
            <select value={value} onChange={(e) => onChange(e.target.value)} required={required}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition">
                <option value="">Select</option>
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    )
}

export default Register