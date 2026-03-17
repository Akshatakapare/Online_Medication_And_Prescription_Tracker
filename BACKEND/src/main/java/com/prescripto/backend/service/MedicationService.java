package com.prescripto.backend.service;

import com.prescripto.backend.entity.*;
import com.prescripto.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

/**
 * MEDICATION SERVICE
 * ===================
 * Handles:
 * - Daily medicine schedule (morning/evening/night)
 * - Mark dose as Taken/Missed
 * - Track medication adherence
 */

@Service
public class MedicationService {

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private MedicationLogRepository logRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;


    /**
     * GET TODAY'S SCHEDULE
     * Patient ke liye aaj ki saari medicines (morning/evening/night)
     */
    public Map<String, Object> getTodaySchedule(String patientId) {

        String today = LocalDate.now().toString();

        // Get all active prescriptions for this patient
        List<Prescription> activePrescriptions = prescriptionRepository
                .findByPatientIdAndStatus(patientId, "ACTIVE");

        // Lists for morning, evening, night
        List<Map<String, Object>> morning = new ArrayList<>();
        List<Map<String, Object>> evening = new ArrayList<>();
        List<Map<String, Object>> night = new ArrayList<>();

        for (Prescription p : activePrescriptions) {

            List<Medicine> medicines = medicineRepository.findByPrescriptionId(p.getId());

            for (Medicine med : medicines) {

                // Check if today is within medicine date range
                if (today.compareTo(med.getStartDate()) >= 0 && today.compareTo(med.getEndDate()) <= 0) {
                    // compareTo: 0 = equal, positive = after, negative = before

                    // Check timing and add to correct list
                    String timing = med.getTiming();

                    if (timing.contains("MORNING")) {
                        morning.add(buildMedicineItem(med, today, "MORNING"));
                    }
                    if (timing.contains("EVENING")) {
                        evening.add(buildMedicineItem(med, today, "EVENING"));
                    }
                    if (timing.contains("NIGHT")) {
                        night.add(buildMedicineItem(med, today, "NIGHT"));
                    }
                }
            }
        }

        Map<String, Object> schedule = new HashMap<>();
        schedule.put("date", today);
        schedule.put("morning", morning);
        schedule.put("evening", evening);
        schedule.put("night", night);

        return schedule;
    }


    /**
     * Build medicine item with status
     */
    private Map<String, Object> buildMedicineItem(Medicine med, String date, String timing) {

        Map<String, Object> item = new HashMap<>();
        item.put("medicineId", med.getId());
        item.put("name", med.getName());
        item.put("dosage", med.getDosage());
        item.put("instructions", med.getInstructions());
        item.put("timing", timing);

        // Check if already logged (taken/missed)
        MedicationLog log = logRepository.findByMedicineIdAndDateAndTiming(med.getId(), date, timing);

        if (log != null) {
            item.put("status", log.getStatus());
            item.put("logId", log.getId());
        } else {
            item.put("status", "PENDING");
            item.put("logId", null);
        }

        return item;
    }


    /**
     * MARK DOSE - Taken or Missed
     * Patient marks a medicine as taken or missed
     */
    public String markDose(Map<String, Object> data) {

        Long medicineId = Long.parseLong(data.get("medicineId").toString());
        String patientId = (String) data.get("patientId");
        String date = (String) data.get("date");
        String timing = (String) data.get("timing");
        String status = (String) data.get("status");
        // status = "TAKEN" or "MISSED"

        // Check if already logged
        MedicationLog existing = logRepository.findByMedicineIdAndDateAndTiming(medicineId, date, timing);

        if (existing != null) {
            // Update existing log
            existing.setStatus(status);
            logRepository.save(existing);
        } else {
            // Create new log
            MedicationLog log = new MedicationLog();
            log.setMedicineId(medicineId);
            log.setPatientId(patientId);
            log.setDate(date);
            log.setTiming(timing);
            log.setStatus(status);
            logRepository.save(log);
        }

        return "Dose marked as " + status + "!";
    }


    /**
     * GET MEDICATION HISTORY
     * Patient ki medicine history date wise
     */
    public List<Map<String, Object>> getMedicationHistory(String patientId) {

        List<MedicationLog> logs = logRepository.findByPatientId(patientId);

        List<Map<String, Object>> result = new ArrayList<>();

        for (MedicationLog log : logs) {

            Map<String, Object> item = new HashMap<>();
            item.put("id", log.getId());
            item.put("date", log.getDate());
            item.put("timing", log.getTiming());
            item.put("status", log.getStatus());

            // Medicine name
            Medicine med = medicineRepository.findById(log.getMedicineId()).orElse(null);
            item.put("medicineName", med != null ? med.getName() : "Unknown");
            item.put("dosage", med != null ? med.getDosage() : "");

            result.add(item);
        }

        return result;
    }


    /**
     * GET ADHERENCE STATS
     * Patient ki overall medication adherence
     * Kitni medicines li, kitni miss ki
     */
    public Map<String, Object> getAdherenceStats(String patientId) {

        List<MedicationLog> logs = logRepository.findByPatientId(patientId);

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

        double adherencePercentage = total > 0 ? (taken * 100.0 / total) : 0;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalDoses", total);
        stats.put("taken", taken);
        stats.put("missed", missed);
        stats.put("adherencePercentage", Math.round(adherencePercentage));

        return stats;
    }
}