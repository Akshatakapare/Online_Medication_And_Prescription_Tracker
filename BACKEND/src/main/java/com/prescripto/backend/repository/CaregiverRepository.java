package com.prescripto.backend.repository;

import com.prescripto.backend.entity.Caregiver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * CAREGIVER REPOSITORY
 * =====================
 * Database operations for caregivers table
 */

@Repository
public interface CaregiverRepository extends JpaRepository<Caregiver, Long> {

    Caregiver findByUserId(Long userId);

    List<Caregiver> findByAssignedPatientId(String patientId);
}