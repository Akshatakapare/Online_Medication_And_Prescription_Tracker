package com.prescripto.backend.scheduler;

import com.prescripto.backend.entity.*;
import com.prescripto.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * REMINDER SCHEDULER (CRON JOB)
 * ==============================
 * Automatic tasks:
 *
 * 1. Auto-mark MISSED doses when time passes
 *    - Morning dose: after 12:00 PM
 *    - Evening dose: after 6:00 PM
 *    - Night dose: after 11:55 PM
 *
 * Cron Format: "second minute hour day month weekday"
 * Example: "0 0 12 * * *" = Daily at 12:00 PM
 */

@Component
public class ReminderScheduler {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private MedicationLogRepository medicationLogRepository;

    @Autowired
    private PatientRepository patientRepository;


    /**
     * MORNING DOSE - Mark missed at 12:00 PM
     * Runs daily at 12:00 PM
     */
    @Scheduled(cron = "0 0 12 * * *")
    public void markMorningMissed() {
        System.out.println("⏰ [CRON] Checking Morning doses at " + LocalTime.now());
        markMissedDoses("MORNING");
    }


    /**
     * EVENING DOSE - Mark missed at 6:00 PM
     * Runs daily at 6:00 PM
     */
    @Scheduled(cron = "0 0 18 * * *")
    public void markEveningMissed() {
        System.out.println("⏰ [CRON] Checking Evening doses at " + LocalTime.now());
        markMissedDoses("EVENING");
    }


    /**
     * NIGHT DOSE - Mark missed at 11:55 PM
     * Runs daily at 11:55 PM
     */
    @Scheduled(cron = "0 55 23 * * *")
    public void markNightMissed() {
        System.out.println("⏰ [CRON] Checking Night doses at " + LocalTime.now());
        markMissedDoses("NIGHT");
    }


    /**
     * COMMON METHOD - Mark doses as MISSED
     * Jo doses patient ne nahi liye, unhe MISSED mark karo
     */
    private void markMissedDoses(String timing) {

        String today = LocalDate.now().toString();

        // Get all patients
        List<Patient> allPatients = patientRepository.findAll();

        for (Patient patient : allPatients) {

            String patientId = patient.getPatientId();

            // Get active prescriptions
            List<Prescription> activePrescriptions = prescriptionRepository
                    .findByPatientIdAndStatus(patientId, "ACTIVE");

            for (Prescription p : activePrescriptions) {

                List<Medicine> medicines = medicineRepository.findByPrescriptionId(p.getId());

                for (Medicine med : medicines) {

                    // Check if medicine timing matches
                    if (!med.getTiming().contains(timing)) {
                        continue;
                    }

                    // Check if today is within date range
                    boolean isForToday = today.compareTo(med.getStartDate()) >= 0
                            && today.compareTo(med.getEndDate()) <= 0;

                    if (!isForToday) {
                        continue;
                    }

                    // Check if already logged
                    MedicationLog existingLog = medicationLogRepository
                            .findByMedicineIdAndDateAndTiming(med.getId(), today, timing);

                    // If not logged, create MISSED log
                    if (existingLog == null) {

                        MedicationLog missedLog = new MedicationLog();
                        missedLog.setMedicineId(med.getId());
                        missedLog.setPatientId(patientId);
                        missedLog.setDate(today);
                        missedLog.setTiming(timing);
                        missedLog.setStatus("MISSED");

                        medicationLogRepository.save(missedLog);

                        System.out.println("❌ [AUTO-MISSED] " + med.getName()
                                + " for " + patientId + " (" + timing + ")");
                    }
                }
            }
        }

        System.out.println("✅ [CRON] " + timing + " check completed");
    }


    /**
     * TEST SCHEDULER - Runs every minute
     * Uncomment for testing, comment in production
     */
    // @Scheduled(cron = "0 * * * * *")
    // public void testScheduler() {
    //     System.out.println("🔔 [TEST] Scheduler running at " + LocalTime.now());
    // }
}