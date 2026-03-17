package com.prescripto.backend.service;

import com.prescripto.backend.entity.*;
import com.prescripto.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

/**
 * PRESCRIPTION SERVICE
 * =====================
 * Handles:
 * - Doctor creates prescription with medicines
 * - Patient views prescriptions
 * - Get prescription details
 */

@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;


    /**
     * CREATE PRESCRIPTION
     * Doctor creates prescription with medicines for a patient
     */
    public String createPrescription(Map<String, Object> data) {

        // Extract prescription data
        String patientId = (String) data.get("patientId");
        Long doctorId = Long.parseLong(data.get("doctorId").toString());

        // Verify patient exists
        if (!patientRepository.existsByPatientId(patientId)) {
            return "Patient not found!";
        }

        // Get today's date
        String today = LocalDate.now().toString();
        // LocalDate.now() = aaj ki date
        // .toString() = "2024-01-15" format

        // Create prescription
        Prescription prescription = new Prescription();
        prescription.setDoctorId(doctorId);
        prescription.setPatientId(patientId);
        prescription.setDiagnosis((String) data.get("diagnosis"));
        prescription.setNotes((String) data.get("notes"));
        prescription.setCreatedDate(today);
        prescription.setStatus("ACTIVE");

        Prescription saved = prescriptionRepository.save(prescription);

        // Add medicines
        List<Map<String, Object>> medicines = (List<Map<String, Object>>) data.get("medicines");

        if (medicines != null) {
            for (Map<String, Object> med : medicines) {

                Medicine medicine = new Medicine();
                medicine.setPrescriptionId(saved.getId());
                medicine.setName((String) med.get("name"));
                medicine.setDosage((String) med.get("dosage"));
                medicine.setTiming((String) med.get("timing"));
                medicine.setInstructions((String) med.get("instructions"));

                // Duration
                int duration = 7; // Default 7 days
                if (med.get("durationDays") != null) {
                    duration = Integer.parseInt(med.get("durationDays").toString());
                }
                medicine.setDurationDays(duration);

                // Calculate start and end dates
                medicine.setStartDate(today);
                LocalDate endDate = LocalDate.now().plusDays(duration);
                medicine.setEndDate(endDate.toString());

                medicineRepository.save(medicine);
            }
        }

        return "Prescription created successfully!";
    }


    /**
     * GET PRESCRIPTIONS BY PATIENT
     * Patient dekh sakta hai apni saari prescriptions
     */
    public List<Map<String, Object>> getPatientPrescriptions(String patientId) {

        List<Prescription> prescriptions = prescriptionRepository
                .findByPatientIdOrderByCreatedDateDesc(patientId);

        List<Map<String, Object>> result = new ArrayList<>();

        for (Prescription p : prescriptions) {

            Map<String, Object> data = new HashMap<>();
            data.put("id", p.getId());
            data.put("diagnosis", p.getDiagnosis());
            data.put("notes", p.getNotes());
            data.put("createdDate", p.getCreatedDate());
            data.put("status", p.getStatus());

            // Doctor ka naam lao
            User doctor = userRepository.findById(p.getDoctorId()).orElse(null);
            data.put("doctorName", doctor != null ? doctor.getFullName() : "Unknown");

            // Medicines lao
            List<Medicine> medicines = medicineRepository.findByPrescriptionId(p.getId());
            data.put("medicines", medicines);

            result.add(data);
        }

        return result;
    }


    /**
     * GET PRESCRIPTIONS BY DOCTOR
     * Doctor dekh sakta hai apni di hui prescriptions
     */
    public List<Map<String, Object>> getDoctorPrescriptions(Long doctorId) {

        List<Prescription> prescriptions = prescriptionRepository.findByDoctorId(doctorId);

        List<Map<String, Object>> result = new ArrayList<>();

        for (Prescription p : prescriptions) {

            Map<String, Object> data = new HashMap<>();
            data.put("id", p.getId());
            data.put("patientId", p.getPatientId());
            data.put("diagnosis", p.getDiagnosis());
            data.put("createdDate", p.getCreatedDate());
            data.put("status", p.getStatus());

            // Patient ka naam lao
            Patient patient = patientRepository.findByPatientId(p.getPatientId());
            if (patient != null) {
                User patientUser = userRepository.findById(patient.getUserId()).orElse(null);
                data.put("patientName", patientUser != null ? patientUser.getFullName() : "Unknown");
            }

            // Medicines
            List<Medicine> medicines = medicineRepository.findByPrescriptionId(p.getId());
            data.put("medicines", medicines);

            result.add(data);
        }

        return result;
    }


    /**
     * GET SINGLE PRESCRIPTION DETAIL
     */
    public Map<String, Object> getPrescriptionById(Long id) {

        Prescription p = prescriptionRepository.findById(id).orElse(null);

        if (p == null) {
            return null;
        }

        Map<String, Object> data = new HashMap<>();
        data.put("id", p.getId());
        data.put("patientId", p.getPatientId());
        data.put("diagnosis", p.getDiagnosis());
        data.put("notes", p.getNotes());
        data.put("createdDate", p.getCreatedDate());
        data.put("status", p.getStatus());

        // Doctor name
        User doctor = userRepository.findById(p.getDoctorId()).orElse(null);
        data.put("doctorName", doctor != null ? doctor.getFullName() : "Unknown");

        // Patient name
        Patient patient = patientRepository.findByPatientId(p.getPatientId());
        if (patient != null) {
            User patientUser = userRepository.findById(patient.getUserId()).orElse(null);
            data.put("patientName", patientUser != null ? patientUser.getFullName() : "Unknown");
        }

        // Medicines
        List<Medicine> medicines = medicineRepository.findByPrescriptionId(p.getId());
        data.put("medicines", medicines);

        return data;
    }
}