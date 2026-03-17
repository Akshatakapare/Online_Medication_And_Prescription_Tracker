package com.prescripto.backend.service;

import com.prescripto.backend.entity.*;
import com.prescripto.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

/**
 * APPOINTMENT SERVICE
 * ====================
 * Appointment booking & management
 */

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;


    /**
     * GET DOCTOR'S APPOINTMENTS
     */
    public List<Map<String, Object>> getDoctorAppointments(Long doctorId) {

        List<Appointment> appointments = appointmentRepository
                .findByDoctorIdOrderByAppointmentDateDesc(doctorId);

        List<Map<String, Object>> result = new ArrayList<>();

        for (Appointment apt : appointments) {

            Map<String, Object> item = new HashMap<>();
            item.put("id", apt.getId());
            item.put("patientId", apt.getPatientId());
            item.put("appointmentDate", apt.getAppointmentDate());
            item.put("timeSlot", apt.getTimeSlot());
            item.put("reason", apt.getReason());
            item.put("status", apt.getStatus());
            item.put("doctorNotes", apt.getDoctorNotes());

            // Get patient name
            Patient patient = patientRepository.findByPatientId(apt.getPatientId());
            if (patient != null) {
                User patientUser = userRepository.findById(patient.getUserId()).orElse(null);
                item.put("patientName", patientUser != null ? patientUser.getFullName() : "Unknown");
                item.put("patientPhone", patientUser != null ? patientUser.getPhone() : "");
            }

            result.add(item);
        }

        return result;
    }


    /**
     * GET PATIENT'S APPOINTMENTS
     */
    public List<Map<String, Object>> getPatientAppointments(String patientId) {

        List<Appointment> appointments = appointmentRepository
                .findByPatientIdOrderByAppointmentDateDesc(patientId);

        List<Map<String, Object>> result = new ArrayList<>();

        for (Appointment apt : appointments) {

            Map<String, Object> item = new HashMap<>();
            item.put("id", apt.getId());
            item.put("appointmentDate", apt.getAppointmentDate());
            item.put("timeSlot", apt.getTimeSlot());
            item.put("reason", apt.getReason());
            item.put("status", apt.getStatus());
            item.put("doctorNotes", apt.getDoctorNotes());

            // Get doctor name
            User doctorUser = userRepository.findById(apt.getDoctorId()).orElse(null);
            if (doctorUser != null) {
                item.put("doctorName", doctorUser.getFullName());
                item.put("doctorPhone", doctorUser.getPhone());

                Doctor doctor = doctorRepository.findByUserId(doctorUser.getId());
                item.put("specialization", doctor != null ? doctor.getSpecialization() : "");
                item.put("hospitalName", doctor != null ? doctor.getHospitalName() : "");
            }

            result.add(item);
        }

        return result;
    }


    /**
     * BOOK APPOINTMENT
     */
    public String bookAppointment(Map<String, Object> data) {

        Appointment apt = new Appointment();

        apt.setDoctorId(Long.parseLong(data.get("doctorId").toString()));
        apt.setPatientId((String) data.get("patientId"));
        apt.setAppointmentDate((String) data.get("appointmentDate"));
        apt.setTimeSlot((String) data.get("timeSlot"));
        apt.setReason((String) data.get("reason"));
        apt.setStatus("PENDING");
        apt.setCreatedDate(LocalDate.now().toString());

        appointmentRepository.save(apt);

        return "Appointment booked successfully!";
    }


    /**
     * UPDATE STATUS
     */
    public String updateAppointmentStatus(Long id, String status) {

        Appointment apt = appointmentRepository.findById(id).orElse(null);

        if (apt == null) {
            return "Appointment not found!";
        }

        apt.setStatus(status);
        appointmentRepository.save(apt);

        return "Status updated to " + status;
    }
}