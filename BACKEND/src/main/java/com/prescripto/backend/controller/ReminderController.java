package com.prescripto.backend.controller;

import com.prescripto.backend.service.ReminderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REMINDER CONTROLLER
 * ====================
 * Patient ke pending reminders check karo
 */

@RestController
@RequestMapping("/api/prescripto/v1/reminder")
@CrossOrigin(origins = "*")
public class ReminderController {

    @Autowired
    private ReminderService reminderService;


    /**
     * GET PENDING REMINDERS
     * Patient ke liye abhi pending medicines
     * GET /api/prescripto/v1/reminder/pending/PAT-ABC123
     */
    @GetMapping("/pending/{patientId}")
    public Map<String, Object> getPendingReminders(@PathVariable String patientId) {
        return reminderService.getPendingReminders(patientId);
    }
}