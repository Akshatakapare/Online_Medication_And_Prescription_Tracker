package com.prescripto.backend.repository;

import com.prescripto.backend.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * PATIENT REPOSITORY
 * ===================
 * Database operations for patients table
 */

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    Patient findByUserId(Long userId);

    Patient findByPatientId(String patientId);

    boolean existsByPatientId(String patientId);
}