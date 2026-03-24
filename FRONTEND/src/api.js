import axios from 'axios'

const BASE_URL = 'http://localhost:8080/api/prescripto/v1'

// ===== AUTH =====
// User registration
export async function registerUser(userData) {
    const response = await axios.post(BASE_URL + '/auth/register', userData)
    return response.data
}

// User login
export async function loginUser(email, password) {
    const response = await axios.post(BASE_URL + '/auth/login', { email, password })
    return response.data
}

// ===== PATIENTS =====
// Saare patients ki list
export async function getAllPatients() {
    const response = await axios.get(BASE_URL + '/patients')
    return response.data
}

// Patient ID se patient details
export async function getPatientByPatientId(patientId) {
    const response = await axios.get(BASE_URL + '/patients/by-patient-id/' + patientId)
    return response.data
}

// ===== DOCTORS =====
// Saare doctors ki list
export async function getAllDoctors() {
    const response = await axios.get(BASE_URL + '/doctors')
    return response.data
}

// =============================================
// NEW - Doctor ke patients (jinhe prescription di)
// =============================================
export async function getDoctorPatients(doctorId) {
    const response = await axios.get(BASE_URL + '/doctors/' + doctorId + '/my-patients')
    return response.data
}

// =============================================
// NEW - Patient ki report (for doctor view)
// =============================================
export async function getPatientReport(patientId) {
    const response = await axios.get(BASE_URL + '/doctors/patient-report/' + patientId)
    return response.data
}

// ===== CAREGIVERS =====
// Saare caregivers ki list
export async function getAllCaregivers() {
    const response = await axios.get(BASE_URL + '/caregivers')
    return response.data
}

// Patient ke caregivers
export async function getCaregiversOfPatient(patientId) {
    const response = await axios.get(BASE_URL + '/caregivers/patient/' + patientId)
    return response.data
}

// ===== PRESCRIPTIONS =====
// Naya prescription create karo
export async function createPrescription(data) {
    const response = await axios.post(BASE_URL + '/prescriptions', data)
    return response.data
}

// Patient ki saari prescriptions
export async function getPatientPrescriptions(patientId) {
    const response = await axios.get(BASE_URL + '/prescriptions/patient/' + patientId)
    return response.data
}

// Doctor ki di hui prescriptions
export async function getDoctorPrescriptions(doctorId) {
    const response = await axios.get(BASE_URL + '/prescriptions/doctor/' + doctorId)
    return response.data
}

// ===== MEDICATIONS =====
// Aaj ka medicine schedule
export async function getTodaySchedule(patientId) {
    const response = await axios.get(BASE_URL + '/medications/schedule/' + patientId)
    return response.data
}

// Dose mark karo (taken/missed)
export async function markDose(data) {
    const response = await axios.post(BASE_URL + '/medications/mark', data)
    return response.data
}

// Medication history
export async function getMedicationHistory(patientId) {
    const response = await axios.get(BASE_URL + '/medications/history/' + patientId)
    return response.data
}

// Adherence stats
export async function getAdherenceStats(patientId) {
    const response = await axios.get(BASE_URL + '/medications/stats/' + patientId)
    return response.data
}


// =============================================
// NEW APIs
// =============================================

// ===== DROPDOWN =====
// Patients dropdown (for prescription)
export async function getPatientsDropdown() {
    const response = await axios.get(BASE_URL + '/dropdown/patients')
    return response.data
}

// Medicines dropdown (for prescription)
export async function getMedicinesDropdown() {
    const response = await axios.get(BASE_URL + '/dropdown/medicines')
    return response.data
}

// Medicine categories
export async function getMedicineCategories() {
    const response = await axios.get(BASE_URL + '/dropdown/categories')
    return response.data
}

// ===== DASHBOARD STATS =====
export async function getPatientDashboardStats(patientId) {
    const response = await axios.get(BASE_URL + '/dashboard/patient/' + patientId)
    return response.data
}

export async function getDoctorDashboardStats(doctorId) {
    const response = await axios.get(BASE_URL + '/dashboard/doctor/' + doctorId)
    return response.data
}

export async function getCaregiverDashboardStats(patientId) {
    const response = await axios.get(BASE_URL + '/dashboard/caregiver/' + patientId)
    return response.data
}

// ===== REMINDERS =====
export async function getPendingReminders(patientId) {
    const response = await axios.get(BASE_URL + '/reminder/pending/' + patientId)
    return response.data
}

// ===== APPOINTMENTS =====
export async function getDoctorAppointments(doctorId) {
    const response = await axios.get(BASE_URL + '/appointments/doctor/' + doctorId)
    return response.data
}

export async function getPatientAppointments(patientId) {
    const response = await axios.get(BASE_URL + '/appointments/patient/' + patientId)
    return response.data
}

export async function bookAppointment(data) {
    const response = await axios.post(BASE_URL + '/appointments', data)
    return response.data
}

export async function updateAppointmentStatus(id, status) {
    const response = await axios.put(BASE_URL + '/appointments/' + id + '/status', { status })
    return response.data
}

// ===== HEALTH REPORT =====
export async function getHealthReport(patientId) {
    const response = await axios.get(BASE_URL + '/health-report/' + patientId)
    return response.data
}


// =============================================
// ADMIN APIs
// =============================================

// Admin login
export async function adminLogin(email, password) {
    const response = await axios.post(BASE_URL + '/admin/login', { email, password })
    return response.data
}

// Admin dashboard stats
export async function getAdminStats() {
    const response = await axios.get(BASE_URL + '/admin/stats')
    return response.data
}

// Get all patients (admin)
export async function getAdminPatients() {
    const response = await axios.get(BASE_URL + '/admin/patients')
    return response.data
}

// Get all doctors (admin)
export async function getAdminDoctors() {
    const response = await axios.get(BASE_URL + '/admin/doctors')
    return response.data
}

// Get all caregivers (admin)
export async function getAdminCaregivers() {
    const response = await axios.get(BASE_URL + '/admin/caregivers')
    return response.data
}

// Get user details (admin)
export async function getAdminUserDetails(id) {
    const response = await axios.get(BASE_URL + '/admin/user/' + id)
    return response.data
}

// Delete user (admin)
export async function deleteUser(id) {
    const response = await axios.delete(BASE_URL + '/admin/user/' + id)
    return response.data
}