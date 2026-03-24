import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Existing pages
import Landing from './pages/Landing'
import Register from './pages/Register'
import Login from './pages/Login'
import PatientDashboard from './pages/PatientDashboard'
import DoctorDashboard from './pages/DoctorDashboard'
import CaregiverDashboard from './pages/CaregiverDashboard'
import CreatePrescription from './pages/CreatePrescription'
import MyPrescriptions from './pages/MyPrescriptions'
import TodaySchedule from './pages/TodaySchedule'
import DoctorMyPatients from './pages/DoctorMyPatients'
import DoctorPatientReport from './pages/DoctorPatientReport'
import CaregiverPatientDetails from './pages/CaregiverPatientDetails'
import CaregiverMedicineStatus from './pages/CaregiverMedicineStatus'
import CaregiverPrescriptions from './pages/CaregiverPrescriptions'
import HealthReport from './pages/HealthReport'
import Appointments from './pages/Appointments'
import BookAppointment from './pages/BookAppointment'

// NEW - Admin pages
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminPatients from './pages/AdminPatients'
import AdminDoctors from './pages/AdminDoctors'
import AdminCaregivers from './pages/AdminCaregivers'
import AdminUserDetails from './pages/AdminUserDetails'

function App() {

    // Dashboard redirect based on role
    function DashboardRedirect() {
        const userData = localStorage.getItem('user')
        if (!userData) return <Navigate to="/login" />
        
        const user = JSON.parse(userData)
        
        if (user.role === 'PATIENT') return <PatientDashboard />
        if (user.role === 'DOCTOR') return <DoctorDashboard />
        if (user.role === 'CAREGIVER') return <CaregiverDashboard />
        if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" />
        
        return <Navigate to="/login" />
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* Public */}
                <Route path="/" element={<Landing />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                
                {/* Dashboard */}
                <Route path="/dashboard" element={<DashboardRedirect />} />
                
                {/* Doctor */}
                <Route path="/create-prescription" element={<CreatePrescription />} />
                <Route path="/doctor/my-patients" element={<DoctorMyPatients />} />
                <Route path="/doctor/patient-report/:patientId" element={<DoctorPatientReport />} />
                <Route path="/doctor/appointments" element={<Appointments />} />
                
                {/* Patient */}
                <Route path="/my-prescriptions" element={<MyPrescriptions />} />
                <Route path="/today-schedule" element={<TodaySchedule />} />
                <Route path="/health-report" element={<HealthReport />} />
                <Route path="/book-appointment" element={<BookAppointment />} />
                <Route path="/my-appointments" element={<Appointments />} />
                
                {/* Caregiver */}
                <Route path="/caregiver/patient-details" element={<CaregiverPatientDetails />} />
                <Route path="/caregiver/medicine-status" element={<CaregiverMedicineStatus />} />
                <Route path="/caregiver/prescriptions" element={<CaregiverPrescriptions />} />

                {/* Admin Routes - NEW */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/patients" element={<AdminPatients />} />
                <Route path="/admin/doctors" element={<AdminDoctors />} />
                <Route path="/admin/caregivers" element={<AdminCaregivers />} />
                <Route path="/admin/user/:id" element={<AdminUserDetails />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App