package com.prescripto.backend.controller;

import com.prescripto.backend.service.MedicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * MEDICATION CONTROLLER
 * ======================
 * Handles daily schedule & dose tracking
 */

@RestController
@RequestMapping("/api/prescripto/v1/medications")
@CrossOrigin(origins = "*")
public class MedicationController {

    @Autowired
    private MedicationService medicationService;


    // Get today's medicine schedule
    // GET /api/prescripto/v1/medications/schedule/PAT-ABC123
    @GetMapping("/schedule/{patientId}")
    public Map<String, Object> getTodaySchedule(@PathVariable String patientId) {
        return medicationService.getTodaySchedule(patientId);
    }


    // Mark dose as taken/missed
    // POST /api/prescripto/v1/medications/mark
    @PostMapping("/mark")
    public String markDose(@RequestBody Map<String, Object> data) {
        return medicationService.markDose(data);
    }


    // Get medication history
    // GET /api/prescripto/v1/medications/history/PAT-ABC123
    @GetMapping("/history/{patientId}")
    public List<Map<String, Object>> getMedicationHistory(@PathVariable String patientId) {
        return medicationService.getMedicationHistory(patientId);
    }


    // Get adherence stats
    // GET /api/prescripto/v1/medications/stats/PAT-ABC123
    @GetMapping("/stats/{patientId}")
    public Map<String, Object> getAdherenceStats(@PathVariable String patientId) {
        return medicationService.getAdherenceStats(patientId);
    }
}