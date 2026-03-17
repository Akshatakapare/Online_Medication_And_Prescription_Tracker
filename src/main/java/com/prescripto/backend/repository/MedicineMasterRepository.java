package com.prescripto.backend.repository;

import com.prescripto.backend.entity.MedicineMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * MEDICINE MASTER REPOSITORY
 * ===========================
 * Database queries for medicine_master table
 */

@Repository
public interface MedicineMasterRepository extends JpaRepository<MedicineMaster, Long> {

    // Active medicines (for dropdown)
    List<MedicineMaster> findByIsActiveTrue();

    // Find by category
    List<MedicineMaster> findByCategory(String category);

    // Check if exists
    boolean existsByName(String name);
}