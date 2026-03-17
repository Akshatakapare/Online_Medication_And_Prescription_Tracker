package com.prescripto.backend.controller;

import com.prescripto.backend.service.HealthReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * HEALTH REPORT CONTROLLER
 * =========================
 * Patient ki health report
 */

@RestController
@RequestMapping("/api/prescripto/v1/health-report")
@CrossOrigin(origins = "*")
public class HealthReportController {

    @Autowired
    private HealthReportService healthReportService;


    /**
     * GET PATIENT HEALTH REPORT
     * GET /api/prescripto/v1/health-report/PAT-ABC123
     */
    @GetMapping("/{patientId}")
    public Map<String, Object> getHealthReport(@PathVariable String patientId) {
        return healthReportService.getHealthReport(patientId);
    }
}