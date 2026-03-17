package com.prescripto.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * CAREGIVER ENTITY
 * =================
 * Caregiver specific fields
 * assignedPatientId = Patient mapping
 *
 * Table: caregivers
 */

@Entity
@Table(name = "caregivers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Caregiver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to User
    @Column(nullable = false)
    private Long userId;

    // Caregiver specific
    private String relationWithPatient;

    // Patient mapping (PAT-ABC123)
    private String assignedPatientId;
}