package com.prescripto.backend.service;

import com.prescripto.backend.entity.*;
import com.prescripto.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

/**
 * DASHBOARD SERVICE
 * ==================
 * Dashboard stats calculate karo
 */

@Service
public class DashboardService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private MedicationLogRepository medicationLogRepository;


    /**
     * PATIENT DASHBOARD STATS
     * - Today's medicines count
     * - Taken, Missed, Pending count
     * - Overall adherence percentage
     */
    public Map<String, Object> getPatientDashboardStats(String patientId) {

        Map<String, Object> stats = new HashMap<>();
        String today = LocalDate.now().toString();

        // Get active prescriptions
        List<Prescription> activePrescriptions = prescriptionRepository
                .findByPatientIdAndStatus(patientId, "ACTIVE");

        // Count today's medicines
        int totalToday = 0;
        int takenToday = 0;
        int missedToday = 0;
        int pendingToday = 0;

        for (Prescription p : activePrescriptions) {

            List<Medicine> medicines = medicineRepository.findByPrescriptionId(p.getId());

            for (Medicine med : medicines) {

                // Check if medicine is for today (within date range)
                boolean isForToday = today.compareTo(med.getStartDate()) >= 0
                        && today.compareTo(med.getEndDate()) <= 0;

                if (isForToday) {

                    // Count based on timing
                    String timing = med.getTiming();

                    // Check each timing slot
                    if (timing.contains("MORNING")) {
                        totalToday++;
                        String status = getDoseStatus(med.getId(), today, "MORNING");
                        if ("TAKEN".equals(status)) takenToday++;
                        else if ("MISSED".equals(status)) missedToday++;
                        else pendingToday++;
                    }

                    if (timing.contains("EVENING")) {
                        totalToday++;
                        String status = getDoseStatus(med.getId(), today, "EVENING");
                        if ("TAKEN".equals(status)) takenToday++;
                        else if ("MISSED".equals(status)) missedToday++;
                        else pendingToday++;
                    }

                    if (timing.contains("NIGHT")) {
                        totalToday++;
                        String status = getDoseStatus(med.getId(), today, "NIGHT");
                        if ("TAKEN".equals(status)) takenToday++;
                        else if ("MISSED".equals(status)) missedToday++;
                        else pendingToday++;
                    }
                }
            }
        }

        // Today's stats
        stats.put("todayTotal", totalToday);
        stats.put("todayTaken", takenToday);
        stats.put("todayMissed", missedToday);
        stats.put("todayPending", pendingToday);

        // Overall adherence
        List<MedicationLog> allLogs = medicationLogRepository.findByPatientId(patientId);
        int totalLogs = allLogs.size();
        int totalTaken = 0;

        for (MedicationLog log : allLogs) {
            if ("TAKEN".equals(log.getStatus())) {
                totalTaken++;
            }
        }

        int adherence = totalLogs > 0 ? (totalTaken * 100 / totalLogs) : 0;
        stats.put("overallAdherence", adherence);

        // Active prescriptions count
        stats.put("activePrescriptions", activePrescriptions.size());

        return stats;
    }


    /**
     * Helper - Get dose status
     */
    private String getDoseStatus(Long medicineId, String date, String timing) {
        MedicationLog log = medicationLogRepository
                .findByMedicineIdAndDateAndTiming(medicineId, date, timing);

        if (log != null) {
            return log.getStatus();
        }
        return "PENDING";
    }


    /**
     * DOCTOR DASHBOARD STATS
     * - Total patients
     * - Total prescriptions
     * - Today's prescriptions
     */
    public Map<String, Object> getDoctorDashboardStats(Long doctorId) {

        Map<String, Object> stats = new HashMap<>();
        String today = LocalDate.now().toString();

        // Get all prescriptions
        List<Prescription> allPrescriptions = prescriptionRepository.findByDoctorId(doctorId);

        // Unique patients
        Set<String> uniquePatients = new HashSet<>();
        int todayCount = 0;
        int activeCount = 0;

        for (Prescription p : allPrescriptions) {
            uniquePatients.add(p.getPatientId());

            if (today.equals(p.getCreatedDate())) {
                todayCount++;
            }

            if ("ACTIVE".equals(p.getStatus())) {
                activeCount++;
            }
        }

        stats.put("totalPatients", uniquePatients.size());
        stats.put("totalPrescriptions", allPrescriptions.size());
        stats.put("todayPrescriptions", todayCount);
        stats.put("activePrescriptions", activeCount);

        return stats;
    }
}