package com.prescripto.backend.controller;

import com.prescripto.backend.service.CaregiverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * CAREGIVER CONTROLLER
 * =====================
 * Handles: /caregivers/...
 */

@RestController
@RequestMapping("/api/prescripto/v1/caregivers")
@CrossOrigin(origins = "*")
public class CaregiverController {

    @Autowired
    private CaregiverService caregiverService;


    // GET /api/prescripto/v1/caregivers
    @GetMapping
    public List<Map<String, Object>> getAllCaregivers() {
        return caregiverService.getAllCaregivers();
    }


    // GET /api/prescripto/v1/caregivers/1
    @GetMapping("/{id}")
    public Map<String, Object> getCaregiverById(@PathVariable Long id) {
        return caregiverService.getCaregiverById(id);
    }


    // GET /api/prescripto/v1/caregivers/patient/PAT-ABC123
    @GetMapping("/patient/{patientId}")
    public List<Map<String, Object>> getCaregiversOfPatient(@PathVariable String patientId) {
        return caregiverService.getCaregiversOfPatient(patientId);
    }


    // DELETE /api/prescripto/v1/caregivers/1
    @DeleteMapping("/{id}")
    public String deleteCaregiver(@PathVariable Long id) {
        return caregiverService.deleteCaregiver(id);
    }
}