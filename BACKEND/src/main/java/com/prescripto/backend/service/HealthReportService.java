package com.prescripto.backend.service;

import com.prescripto.backend.entity.*;
import com.prescripto.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * HEALTH REPORT SERVICE
 * ======================
 * Patient ki detailed health report
 */

@Service
public class HealthReportService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private MedicationLogRepository medicationLogRepository;


    /**
     * GET HEALTH REPORT
     */
    public Map<String, Object> getHealthReport(String patientId) {

        Map<String, Object> report = new HashMap<>();

        // Patient info
        Patient patient = patientRepository.findByPatientId(patientId);
        if (patient == null) {
            report.put("error", "Patient not found");
            return report;
        }

        User user = userRepository.findById(patient.getUserId()).orElse(null);

        // Basic info
        Map<String, Object> patientInfo = new HashMap<>();
        patientInfo.put("fullName", user != null ? user.getFullName() : "");
        patientInfo.put("patientId", patientId);
        patientInfo.put("bloodGroup", patient.getBloodGroup());
        patientInfo.put("allergies", patient.getAllergies());
        patientInfo.put("phone", user != null ? user.getPhone() : "");
        report.put("patientInfo", patientInfo);

        // Prescription stats
        List<Prescription> allPrescriptions = prescriptionRepository.findByPatientId(patientId);
        List<Prescription> activePrescriptions = prescriptionRepository
                .findByPatientIdAndStatus(patientId, "ACTIVE");

        report.put("totalPrescriptions", allPrescriptions.size());
        report.put("activePrescriptions", activePrescriptions.size());

        // Medication adherence
        List<MedicationLog> allLogs = medicationLogRepository.findByPatientId(patientId);

        int total = allLogs.size();
        int taken = 0;
        int missed = 0;

        for (MedicationLog log : allLogs) {
            if ("TAKEN".equals(log.getStatus())) taken++;
            else if ("MISSED".equals(log.getStatus())) missed++;
        }

        int adherencePercent = total > 0 ? (taken * 100 / total) : 0;

        Map<String, Object> adherence = new HashMap<>();
        adherence.put("totalDoses", total);
        adherence.put("taken", taken);
        adherence.put("missed", missed);
        adherence.put("percentage", adherencePercent);
        report.put("adherence", adherence);

        // Recent medication history (last 20)
        List<Map<String, Object>> history = new ArrayList<>();
        int limit = Math.min(allLogs.size(), 20);

        for (int i = allLogs.size() - 1; i >= allLogs.size() - limit && i >= 0; i--) {
            MedicationLog log = allLogs.get(i);

            Map<String, Object> item = new HashMap<>();
            item.put("date", log.getDate());
            item.put("timing", log.getTiming());
            item.put("status", log.getStatus());

            Medicine med = medicineRepository.findById(log.getMedicineId()).orElse(null);
            item.put("medicineName", med != null ? med.getName() : "Unknown");

            history.add(item);
        }
        report.put("recentHistory", history);

        // Unique doctors consulted
        Set<Long> doctorIds = new HashSet<>();
        for (Prescription p : allPrescriptions) {
            doctorIds.add(p.getDoctorId());
        }
        report.put("doctorsConsulted", doctorIds.size());

        // Health status based on adherence
        String healthStatus = "";
        if (adherencePercent >= 80) {
            healthStatus = "EXCELLENT";
        } else if (adherencePercent >= 60) {
            healthStatus = "GOOD";
        } else if (adherencePercent >= 40) {
            healthStatus = "MODERATE";
        } else {
            healthStatus = "NEEDS_IMPROVEMENT";
        }
        report.put("healthStatus", healthStatus);

        return report;
    }
}