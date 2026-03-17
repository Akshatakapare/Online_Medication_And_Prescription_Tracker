package com.prescripto.backend.repository;

import com.prescripto.backend.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * DOCTOR REPOSITORY
 * ==================
 * Database operations for doctors table
 */

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    Doctor findByUserId(Long userId);

    boolean existsByLicenseNumber(String licenseNumber);

    List<Doctor> findBySpecialization(String specialization);
}