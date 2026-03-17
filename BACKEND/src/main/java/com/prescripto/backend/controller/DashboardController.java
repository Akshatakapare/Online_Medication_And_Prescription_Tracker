package com.prescripto.backend.controller;

import com.prescripto.backend.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * DASHBOARD CONTROLLER
 * =====================
 * Dashboard stats for all roles
 */

@RestController
@RequestMapping("/api/prescripto/v1/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;


    /**
     * PATIENT DASHBOARD STATS
     * GET /api/prescripto/v1/dashboard/patient/PAT-ABC123
     */
    @GetMapping("/patient/{patientId}")
    public Map<String, Object> getPatientStats(@PathVariable String patientId) {
        return dashboardService.getPatientDashboardStats(patientId);
    }


    /**
     * DOCTOR DASHBOARD STATS
     * GET /api/prescripto/v1/dashboard/doctor/5
     */
    @GetMapping("/doctor/{doctorId}")
    public Map<String, Object> getDoctorStats(@PathVariable Long doctorId) {
        return dashboardService.getDoctorDashboardStats(doctorId);
    }


    /**
     * CAREGIVER DASHBOARD STATS
     * Same as patient stats (linked patient ki stats)
     * GET /api/prescripto/v1/dashboard/caregiver/PAT-ABC123
     */
    @GetMapping("/caregiver/{patientId}")
    public Map<String, Object> getCaregiverStats(@PathVariable String patientId) {
        return dashboardService.getPatientDashboardStats(patientId);
    }
}