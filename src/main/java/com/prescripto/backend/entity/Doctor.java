package com.prescripto.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * DOCTOR ENTITY
 * ==============
 * Doctor specific fields
 * Linked to User table via userId
 *
 * Table: doctors
 */

@Entity
@Table(name = "doctors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to User
    @Column(nullable = false)
    private Long userId;

    // Doctor specific
    private String specialization;
    private String qualification;
    private Integer experienceYears;

    @Column(unique = true)
    private String licenseNumber;

    private String hospitalName;
    private Double consultationFee;
}