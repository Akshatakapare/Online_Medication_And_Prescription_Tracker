package com.prescripto.backend.service;

import com.prescripto.backend.entity.*;
import com.prescripto.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * DOCTOR SERVICE
 * ===============
 * All doctor related operations
 */

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private MedicationLogRepository medicationLogRepository;

    @Autowired
    private MedicineRepository medicineRepository;


    /**
     * GET ALL DOCTORS
     * Saare doctors ki list with their details
     */
    public List<Map<String, Object>> getAllDoctors() {

        // Step 1: Users table se DOCTOR role wale lao
        List<User> users = userRepository.findByRole("DOCTOR");
        List<Map<String, Object>> result = new ArrayList<>();

        // Step 2: Har doctor ke liye data combine karo
        for (User user : users) {
            Map<String, Object> data = new HashMap<>();
            data.put("id", user.getId());
            data.put("fullName", user.getFullName());
            data.put("email", user.getEmail());
            data.put("phone", user.getPhone());
            data.put("city", user.getCity());

            // Doctor specific info
            Doctor doctor = doctorRepository.findByUserId(user.getId());
            data.put("doctorInfo", doctor);

            result.add(data);
        }

        return result;
    }


    /**
     * GET DOCTOR BY ID
     * Ek doctor ki complete details
     */
    public Map<String, Object> getDoctorById(Long id) {

        User user = userRepository.findById(id).orElse(null);

        // Check if user exists and is a doctor
        if (user == null || !"DOCTOR".equals(user.getRole())) {
            return null;
        }

        Map<String, Object> data = new HashMap<>();
        data.put("id", user.getId());
        data.put("fullName", user.getFullName());
        data.put("email", user.getEmail());
        data.put("phone", user.getPhone());
        data.put("gender", user.getGender());
        data.put("address", user.getAddress());
        data.put("city", user.getCity());
        data.put("state", user.getState());

        Doctor doctor = doctorRepository.findByUserId(user.getId());
        data.put("doctorInfo", doctor);

        return data;
    }


    /**
     * GET DOCTORS BY SPECIALIZATION
     * Ek specialization ke saare doctors
     */
    public List<Map<String, Object>> getDoctorsBySpecialization(String specialization) {

        List<Doctor> doctors = doctorRepository.findBySpecialization(specialization);
        List<Map<String, Object>> result = new ArrayList<>();

        for (Doctor doctor : doctors) {
            User user = userRepository.findById(doctor.getUserId()).orElse(null);
            if (user != null) {
                Map<String, Object> data = new HashMap<>();
                data.put("id", user.getId());
                data.put("fullName", user.getFullName());
                data.put("phone", user.getPhone());
                data.put("city", user.getCity());
                data.put("doctorInfo", doctor);
                result.add(data);
            }
        }

        return result;
    }


    /**
     * =============================================
     * NEW METHOD - GET MY PATIENTS
     * =============================================
     * Doctor ke saare patients jinhe prescription di hai
     *
     * Logic:
     * 1. Prescriptions table se is doctor ki saari prescriptions lo
     * 2. Un prescriptions se unique patient IDs nikalo
     * 3. Har patient ki details lao
     */
    public List<Map<String, Object>> getMyPatients(Long doctorId) {

        // Step 1: Is doctor ki saari prescriptions lao
        List<Prescription> prescriptions = prescriptionRepository.findByDoctorId(doctorId);

        // Step 2: Unique patient IDs nikalo (Set duplicate nahi rakhta)
        Set<String> uniquePatientIds = new HashSet<>();
        for (Prescription p : prescriptions) {
            uniquePatientIds.add(p.getPatientId());
        }

        // Step 3: Har patient ki details lao
        List<Map<String, Object>> result = new ArrayList<>();

        for (String patientId : uniquePatientIds) {

            // Patient table se patient lao
            Patient patient = patientRepository.findByPatientId(patientId);

            if (patient != null) {
                // User table se patient ki common info lao
                User user = userRepository.findById(patient.getUserId()).orElse(null);

                if (user != null) {
                    Map<String, Object> data = new HashMap<>();

                    // Basic info from users table
                    data.put("id", user.getId());
                    data.put("fullName", user.getFullName());
                    data.put("phone", user.getPhone());
                    data.put("email", user.getEmail());
                    data.put("gender", user.getGender());
                    data.put("city", user.getCity());

                    // Patient specific info
                    data.put("patientId", patient.getPatientId());
                    data.put("bloodGroup", patient.getBloodGroup());
                    data.put("allergies", patient.getAllergies());

                    // Count prescriptions for this patient by this doctor
                    int prescriptionCount = 0;
                    for (Prescription p : prescriptions) {
                        if (p.getPatientId().equals(patientId)) {
                            prescriptionCount++;
                        }
                    }
                    data.put("prescriptionCount", prescriptionCount);

                    result.add(data);
                }
            }
        }

        return result;
    }


    /**
     * =============================================
     * NEW METHOD - GET PATIENT REPORT
     * =============================================
     * Patient ki medication adherence report
     *
     * Includes:
     * - Patient details
     * - Total doses
     * - Taken doses
     * - Missed doses
     * - Adherence percentage
     * - Recent medication history
     */
    public Map<String, Object> getPatientReport(String patientId) {

        Map<String, Object> report = new HashMap<>();

        // Step 1: Patient ki basic info lao
        Patient patient = patientRepository.findByPatientId(patientId);

        if (patient == null) {
            report.put("error", "Patient not found");
            return report;
        }

        User user = userRepository.findById(patient.getUserId()).orElse(null);

        if (user == null) {
            report.put("error", "User not found");
            return report;
        }

        // Patient info
        Map<String, Object> patientInfo = new HashMap<>();
        patientInfo.put("fullName", user.getFullName());
        patientInfo.put("phone", user.getPhone());
        patientInfo.put("email", user.getEmail());
        patientInfo.put("patientId", patient.getPatientId());
        patientInfo.put("bloodGroup", patient.getBloodGroup());
        patientInfo.put("allergies", patient.getAllergies());
        report.put("patient", patientInfo);

        // Step 2: Medication logs se stats nikalo
        List<MedicationLog> logs = medicationLogRepository.findByPatientId(patientId);

        int total = logs.size();
        int taken = 0;
        int missed = 0;

        for (MedicationLog log : logs) {
            if ("TAKEN".equals(log.getStatus())) {
                taken++;
            } else if ("MISSED".equals(log.getStatus())) {
                missed++;
            }
        }

        // Adherence percentage calculate karo
        double adherencePercentage = total > 0 ? (taken * 100.0 / total) : 0;

        // Stats add karo
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalDoses", total);
        stats.put("taken", taken);
        stats.put("missed", missed);
        stats.put("adherencePercentage", Math.round(adherencePercentage));
        report.put("stats", stats);

        // Step 3: Recent medication history (last 10 logs)
        List<Map<String, Object>> history = new ArrayList<>();

        // Last 10 logs lo (ya saari agar kam hain)
        int limit = Math.min(logs.size(), 10);
        for (int i = logs.size() - 1; i >= logs.size() - limit && i >= 0; i--) {
            MedicationLog log = logs.get(i);

            Map<String, Object> item = new HashMap<>();
            item.put("date", log.getDate());
            item.put("timing", log.getTiming());
            item.put("status", log.getStatus());

            // Medicine name lao
            Medicine med = medicineRepository.findById(log.getMedicineId()).orElse(null);
            item.put("medicineName", med != null ? med.getName() : "Unknown");

            history.add(item);
        }
        report.put("recentHistory", history);

        // Step 4: Total prescriptions count
        List<Prescription> prescriptions = prescriptionRepository.findByPatientId(patientId);
        report.put("totalPrescriptions", prescriptions.size());

        return report;
    }


    /**
     * DELETE DOCTOR
     */
    public String deleteDoctor(Long id) {

        User user = userRepository.findById(id).orElse(null);

        if (user == null || !"DOCTOR".equals(user.getRole())) {
            return "Doctor not found!";
        }

        Doctor doctor = doctorRepository.findByUserId(id);
        if (doctor != null) {
            doctorRepository.delete(doctor);
        }

        userRepository.deleteById(id);

        return "Doctor deleted!";
    }
}