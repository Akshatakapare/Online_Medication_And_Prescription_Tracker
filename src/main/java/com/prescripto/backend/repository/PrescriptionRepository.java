package com.prescripto.backend.repository;

import com.prescripto.backend.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    // Patient ki saari prescriptions
    List<Prescription> findByPatientId(String patientId);

    // Patient ki prescriptions date wise (newest first)
    List<Prescription> findByPatientIdOrderByCreatedDateDesc(String patientId);

    // Doctor ki saari prescriptions
    List<Prescription> findByDoctorId(Long doctorId);

    // Patient ki active prescriptions
    List<Prescription> findByPatientIdAndStatus(String patientId, String status);
}