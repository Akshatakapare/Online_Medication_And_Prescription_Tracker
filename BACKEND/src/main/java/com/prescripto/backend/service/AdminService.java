package com.prescripto.backend.service;

import com.prescripto.backend.entity.*;
import com.prescripto.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * ADMIN SERVICE
 * ==============
 * Admin ki saari business logic yahan hai
 *
 * Hardcoded Admin Credentials:
 * Email: admin@prescripto.com
 * Password: admin123
 */

@Service
public class AdminService {

    // ============================================
    // HARDCODED ADMIN CREDENTIALS
    // ============================================
    private static final String ADMIN_EMAIL = "admin@prescripto.com";
    private static final String ADMIN_PASSWORD = "admin123";
    private static final String ADMIN_NAME = "System Admin";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private CaregiverRepository caregiverRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;


    /**
     * ADMIN LOGIN
     * Check hardcoded credentials
     */
    public Map<String, Object> adminLogin(String email, String password) {

        Map<String, Object> response = new HashMap<>();

        // Check credentials
        if (ADMIN_EMAIL.equals(email) && ADMIN_PASSWORD.equals(password)) {
            // Login successful
            response.put("success", true);
            response.put("message", "Login successful!");
            response.put("role", "ADMIN");
            response.put("email", ADMIN_EMAIL);
            response.put("fullName", ADMIN_NAME);
            // Simple token (timestamp based)
            response.put("token", "admin-token-" + System.currentTimeMillis());
        } else {
            // Login failed
            response.put("success", false);
            response.put("message", "Invalid email or password!");
        }

        return response;
    }


    /**
     * GET DASHBOARD STATS
     * Total counts
     */
    public Map<String, Object> getDashboardStats() {

        Map<String, Object> stats = new HashMap<>();

        // Count users by role
        List<User> allPatients = userRepository.findByRole("PATIENT");
        List<User> allDoctors = userRepository.findByRole("DOCTOR");
        List<User> allCaregivers = userRepository.findByRole("CAREGIVER");

        stats.put("totalPatients", allPatients.size());
        stats.put("totalDoctors", allDoctors.size());
        stats.put("totalCaregivers", allCaregivers.size());
        stats.put("totalUsers", allPatients.size() + allDoctors.size() + allCaregivers.size());

        // Prescriptions count
        List<Prescription> allPrescriptions = prescriptionRepository.findAll();
        stats.put("totalPrescriptions", allPrescriptions.size());

        return stats;
    }


    /**
     * GET ALL PATIENTS
     */
    public List<Map<String, Object>> getAllPatients() {

        List<User> users = userRepository.findByRole("PATIENT");
        List<Map<String, Object>> result = new ArrayList<>();

        for (User user : users) {

            Map<String, Object> data = new HashMap<>();

            // User info
            data.put("id", user.getId());
            data.put("fullName", user.getFullName());
            data.put("email", user.getEmail());
            data.put("phone", user.getPhone());
            data.put("gender", user.getGender());
            data.put("city", user.getCity());

            // Patient specific info
            Patient patient = patientRepository.findByUserId(user.getId());
            if (patient != null) {
                data.put("patientId", patient.getPatientId());
                data.put("bloodGroup", patient.getBloodGroup());
                data.put("allergies", patient.getAllergies());
            }

            result.add(data);
        }

        return result;
    }


    /**
     * GET ALL DOCTORS
     */
    public List<Map<String, Object>> getAllDoctors() {

        List<User> users = userRepository.findByRole("DOCTOR");
        List<Map<String, Object>> result = new ArrayList<>();

        for (User user : users) {

            Map<String, Object> data = new HashMap<>();

            // User info
            data.put("id", user.getId());
            data.put("fullName", user.getFullName());
            data.put("email", user.getEmail());
            data.put("phone", user.getPhone());
            data.put("gender", user.getGender());
            data.put("city", user.getCity());

            // Doctor specific info
            Doctor doctor = doctorRepository.findByUserId(user.getId());
            if (doctor != null) {
                data.put("specialization", doctor.getSpecialization());
                data.put("qualification", doctor.getQualification());
                data.put("hospitalName", doctor.getHospitalName());
                data.put("experienceYears", doctor.getExperienceYears());
                data.put("licenseNumber", doctor.getLicenseNumber());
            }

            result.add(data);
        }

        return result;
    }


    /**
     * GET ALL CAREGIVERS
     */
    public List<Map<String, Object>> getAllCaregivers() {

        List<User> users = userRepository.findByRole("CAREGIVER");
        List<Map<String, Object>> result = new ArrayList<>();

        for (User user : users) {

            Map<String, Object> data = new HashMap<>();

            // User info
            data.put("id", user.getId());
            data.put("fullName", user.getFullName());
            data.put("email", user.getEmail());
            data.put("phone", user.getPhone());
            data.put("gender", user.getGender());
            data.put("city", user.getCity());

            // Caregiver specific info
            Caregiver caregiver = caregiverRepository.findByUserId(user.getId());
            if (caregiver != null) {
                data.put("relationWithPatient", caregiver.getRelationWithPatient());
                data.put("assignedPatientId", caregiver.getAssignedPatientId());

                // Get assigned patient name
                if (caregiver.getAssignedPatientId() != null) {
                    Patient patient = patientRepository.findByPatientId(caregiver.getAssignedPatientId());
                    if (patient != null) {
                        User patientUser = userRepository.findById(patient.getUserId()).orElse(null);
                        if (patientUser != null) {
                            data.put("assignedPatientName", patientUser.getFullName());
                        }
                    }
                }
            }

            result.add(data);
        }

        return result;
    }


    /**
     * GET USER DETAILS BY ID
     * Complete user details
     */
    public Map<String, Object> getUserDetails(Long id) {

        Map<String, Object> data = new HashMap<>();

        // Find user
        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            data.put("error", "User not found!");
            return data;
        }

        // Common info
        data.put("id", user.getId());
        data.put("fullName", user.getFullName());
        data.put("email", user.getEmail());
        data.put("phone", user.getPhone());
        data.put("gender", user.getGender());
        data.put("dateOfBirth", user.getDateOfBirth());
        data.put("address", user.getAddress());
        data.put("city", user.getCity());
        data.put("state", user.getState());
        data.put("pincode", user.getPincode());
        data.put("role", user.getRole());

        // Role specific info
        if ("PATIENT".equals(user.getRole())) {
            Patient patient = patientRepository.findByUserId(user.getId());
            if (patient != null) {
                data.put("patientId", patient.getPatientId());
                data.put("bloodGroup", patient.getBloodGroup());
                data.put("allergies", patient.getAllergies());
                data.put("emergencyContactName", patient.getEmergencyContactName());
                data.put("emergencyContactPhone", patient.getEmergencyContactPhone());
            }
        }

        if ("DOCTOR".equals(user.getRole())) {
            Doctor doctor = doctorRepository.findByUserId(user.getId());
            if (doctor != null) {
                data.put("specialization", doctor.getSpecialization());
                data.put("qualification", doctor.getQualification());
                data.put("hospitalName", doctor.getHospitalName());
                data.put("experienceYears", doctor.getExperienceYears());
                data.put("licenseNumber", doctor.getLicenseNumber());
                data.put("consultationFee", doctor.getConsultationFee());
            }
        }

        if ("CAREGIVER".equals(user.getRole())) {
            Caregiver caregiver = caregiverRepository.findByUserId(user.getId());
            if (caregiver != null) {
                data.put("relationWithPatient", caregiver.getRelationWithPatient());
                data.put("assignedPatientId", caregiver.getAssignedPatientId());
            }
        }

        return data;
    }


    /**
     * DELETE USER
     * Delete user and role specific data
     */
    public String deleteUser(Long id) {

        // Find user
        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return "User not found!";
        }

        String role = user.getRole();

        // Delete role specific data first
        if ("PATIENT".equals(role)) {
            Patient patient = patientRepository.findByUserId(id);
            if (patient != null) {
                patientRepository.delete(patient);
            }
        }

        if ("DOCTOR".equals(role)) {
            Doctor doctor = doctorRepository.findByUserId(id);
            if (doctor != null) {
                doctorRepository.delete(doctor);
            }
        }

        if ("CAREGIVER".equals(role)) {
            Caregiver caregiver = caregiverRepository.findByUserId(id);
            if (caregiver != null) {
                caregiverRepository.delete(caregiver);
            }
        }

        // Delete user
        userRepository.deleteById(id);

        return "User deleted successfully!";
    }
}