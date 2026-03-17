package com.prescripto.backend.controller;

import com.prescripto.backend.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * PRESCRIPTION CONTROLLER
 * ========================
 * Handles prescription CRUD operations
 */

@RestController
@RequestMapping("/api/prescripto/v1/prescriptions")
@CrossOrigin(origins = "*")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;


    // Doctor creates prescription
    // POST /api/prescripto/v1/prescriptions
    @PostMapping
    public String createPrescription(@RequestBody Map<String, Object> data) {
        return prescriptionService.createPrescription(data);
    }


    // Get prescriptions by patient
    // GET /api/prescripto/v1/prescriptions/patient/PAT-ABC123
    @GetMapping("/patient/{patientId}")
    public List<Map<String, Object>> getPatientPrescriptions(@PathVariable String patientId) {
        return prescriptionService.getPatientPrescriptions(patientId);
    }


    // Get prescriptions by doctor
    // GET /api/prescripto/v1/prescriptions/doctor/2
    @GetMapping("/doctor/{doctorId}")
    public List<Map<String, Object>> getDoctorPrescriptions(@PathVariable Long doctorId) {
        return prescriptionService.getDoctorPrescriptions(doctorId);
    }


    // Get single prescription detail
    // GET /api/prescripto/v1/prescriptions/1
    @GetMapping("/{id}")
    public Map<String, Object> getPrescriptionById(@PathVariable Long id) {
        return prescriptionService.getPrescriptionById(id);
    }
}