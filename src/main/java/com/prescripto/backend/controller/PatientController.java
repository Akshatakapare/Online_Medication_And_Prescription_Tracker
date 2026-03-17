package com.prescripto.backend.controller;

import com.prescripto.backend.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * PATIENT CONTROLLER
 * ===================
 * Handles: /patients/...
 */

@RestController
@RequestMapping("/api/prescripto/v1/patients")
@CrossOrigin(origins = "*")
public class PatientController {

    @Autowired
    private PatientService patientService;


    // GET /api/prescripto/v1/patients
    @GetMapping
    public List<Map<String, Object>> getAllPatients() {
        return patientService.getAllPatients();
    }


    // GET /api/prescripto/v1/patients/1
    @GetMapping("/{id}")
    public Map<String, Object> getPatientById(@PathVariable Long id) {
        return patientService.getPatientById(id);
    }


    // GET /api/prescripto/v1/patients/by-patient-id/PAT-ABC123
    @GetMapping("/by-patient-id/{patientId}")
    public Map<String, Object> getPatientByPatientId(@PathVariable String patientId) {
        return patientService.getPatientByPatientId(patientId);
    }


    // DELETE /api/prescripto/v1/patients/1
    @DeleteMapping("/{id}")
    public String deletePatient(@PathVariable Long id) {
        return patientService.deletePatient(id);
    }
}