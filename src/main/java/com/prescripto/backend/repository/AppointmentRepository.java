package com.prescripto.backend.repository;

import com.prescripto.backend.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // Doctor ke appointments
    List<Appointment> findByDoctorIdOrderByAppointmentDateDesc(Long doctorId);

    // Patient ke appointments
    List<Appointment> findByPatientIdOrderByAppointmentDateDesc(String patientId);

    // Doctor ke aaj ke appointments
    List<Appointment> findByDoctorIdAndAppointmentDate(Long doctorId, String date);
}