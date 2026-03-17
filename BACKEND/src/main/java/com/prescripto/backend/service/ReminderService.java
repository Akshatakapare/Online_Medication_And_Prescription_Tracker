package com.prescripto.backend.service;

import com.prescripto.backend.entity.*;
import com.prescripto.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

/**
 * REMINDER SERVICE
 * =================
 * Pending medicines check karo
 * Current time ke hisaab se reminder dikhao
 */

@Service
public class ReminderService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private MedicationLogRepository medicationLogRepository;


    /**
     * GET PENDING REMINDERS
     * Current time ke hisaab se pending medicines
     */
    public Map<String, Object> getPendingReminders(String patientId) {

        Map<String, Object> result = new HashMap<>();
        String today = LocalDate.now().toString();
        int currentHour = LocalTime.now().getHour();

        // Determine current time slot
        // Morning: 6 AM - 12 PM
        // Evening: 12 PM - 6 PM
        // Night: 6 PM - 12 AM
        String currentSlot = "";
        String reminderMessage = "";

        if (currentHour >= 6 && currentHour < 12) {
            currentSlot = "MORNING";
            reminderMessage = "🌅 Good Morning! Time to take your morning medicines.";
        } else if (currentHour >= 12 && currentHour < 18) {
            currentSlot = "EVENING";
            reminderMessage = "🌆 Good Afternoon! Time to take your evening medicines.";
        } else {
            currentSlot = "NIGHT";
            reminderMessage = "🌙 Good Evening! Time to take your night medicines.";
        }

        result.put("currentSlot", currentSlot);
        result.put("reminderMessage", reminderMessage);

        // Get pending medicines for current slot
        List<Map<String, Object>> pendingMedicines = new ArrayList<>();

        List<Prescription> activePrescriptions = prescriptionRepository
                .findByPatientIdAndStatus(patientId, "ACTIVE");

        for (Prescription p : activePrescriptions) {

            List<Medicine> medicines = medicineRepository.findByPrescriptionId(p.getId());

            for (Medicine med : medicines) {

                // Check if medicine is for today
                boolean isForToday = today.compareTo(med.getStartDate()) >= 0
                        && today.compareTo(med.getEndDate()) <= 0;

                // Check if medicine is for current slot
                boolean isForCurrentSlot = med.getTiming().contains(currentSlot);

                if (isForToday && isForCurrentSlot) {

                    // Check if already taken
                    MedicationLog log = medicationLogRepository
                            .findByMedicineIdAndDateAndTiming(med.getId(), today, currentSlot);

                    // If not logged or status is PENDING
                    if (log == null) {
                        Map<String, Object> item = new HashMap<>();
                        item.put("medicineId", med.getId());
                        item.put("name", med.getName());
                        item.put("dosage", med.getDosage());
                        item.put("instructions", med.getInstructions());
                        item.put("timing", currentSlot);
                        pendingMedicines.add(item);
                    }
                }
            }
        }

        result.put("pendingMedicines", pendingMedicines);
        result.put("pendingCount", pendingMedicines.size());
        result.put("hasReminder", pendingMedicines.size() > 0);

        return result;
    }
}