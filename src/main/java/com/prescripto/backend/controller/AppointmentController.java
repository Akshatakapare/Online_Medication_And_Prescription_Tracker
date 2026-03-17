package com.prescripto.backend.controller;

import com.prescripto.backend.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * APPOINTMENT CONTROLLER
 * =======================
 * Simple appointment booking system
 */

@RestController
@RequestMapping("/api/prescripto/v1/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;


    /**
     * GET DOCTOR'S APPOINTMENTS
     * GET /api/prescripto/v1/appointments/doctor/5
     */
    @GetMapping("/doctor/{doctorId}")
    public List<Map<String, Object>> getDoctorAppointments(@PathVariable Long doctorId) {
        return appointmentService.getDoctorAppointments(doctorId);
    }


    /**
     * GET PATIENT'S APPOINTMENTS
     * GET /api/prescripto/v1/appointments/patient/PAT-ABC123
     */
    @GetMapping("/patient/{patientId}")
    public List<Map<String, Object>> getPatientAppointments(@PathVariable String patientId) {
        return appointmentService.getPatientAppointments(patientId);
    }


    /**
     * BOOK APPOINTMENT
     * POST /api/prescripto/v1/appointments
     */
    @PostMapping
    public String bookAppointment(@RequestBody Map<String, Object> data) {
        return appointmentService.bookAppointment(data);
    }


    /**
     * UPDATE APPOINTMENT STATUS
     * PUT /api/prescripto/v1/appointments/1/status
     */
    @PutMapping("/{id}/status")
    public String updateStatus(@PathVariable Long id, @RequestBody Map<String, String> data) {
        return appointmentService.updateAppointmentStatus(id, data.get("status"));
    }
}