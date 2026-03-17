package com.prescripto.backend.controller;

import com.prescripto.backend.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * DOCTOR CONTROLLER
 * ==================
 * Handles: /doctors/...
 */

@RestController
@RequestMapping("/api/prescripto/v1/doctors")
@CrossOrigin(origins = "*")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;


    // GET /api/prescripto/v1/doctors
    // Saare doctors ki list
    @GetMapping
    public List<Map<String, Object>> getAllDoctors() {
        return doctorService.getAllDoctors();
    }


    // GET /api/prescripto/v1/doctors/1
    // Ek doctor ki details by ID
    @GetMapping("/{id}")
    public Map<String, Object> getDoctorById(@PathVariable Long id) {
        return doctorService.getDoctorById(id);
    }


    // GET /api/prescripto/v1/doctors/specialization/Cardiologist
    // Doctors by specialization
    @GetMapping("/specialization/{specialization}")
    public List<Map<String, Object>> getDoctorsBySpecialization(@PathVariable String specialization) {
        return doctorService.getDoctorsBySpecialization(specialization);
    }


    // =============================================
    // NEW API - Get all patients of a doctor
    // =============================================
    // GET /api/prescripto/v1/doctors/5/my-patients
    // Doctor ke saare patients jinhe usne prescription di hai
    @GetMapping("/{doctorId}/my-patients")
    public List<Map<String, Object>> getMyPatients(@PathVariable Long doctorId) {
        return doctorService.getMyPatients(doctorId);
    }


    // =============================================
    // NEW API - Get specific patient report for doctor
    // =============================================
    // GET /api/prescripto/v1/doctors/patient-report/PAT-ABC123
    // Patient ki medication report (adherence stats)
    @GetMapping("/patient-report/{patientId}")
    public Map<String, Object> getPatientReport(@PathVariable String patientId) {
        return doctorService.getPatientReport(patientId);
    }


    // DELETE /api/prescripto/v1/doctors/1
    @DeleteMapping("/{id}")
    public String deleteDoctor(@PathVariable Long id) {
        return doctorService.deleteDoctor(id);
    }
}