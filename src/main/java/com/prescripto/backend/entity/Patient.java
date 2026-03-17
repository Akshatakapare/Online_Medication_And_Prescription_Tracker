package com.prescripto.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * PATIENT ENTITY
 * ===============
 * Patient specific fields
 * Linked to User table via userId
 *
 * Table: patients
 */

@Entity
@Table(name = "patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to User
    @Column(nullable = false)
    private Long userId;

    // Patient specific
    @Column(unique = true)
    private String patientId;  // PAT-ABC123

    private String bloodGroup;
    private String allergies;
    private String emergencyContactName;
    private String emergencyContactPhone;
}