package com.prescripto.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * PRESCRIPTION ENTITY
 * ====================
 * Doctor creates prescription for a patient
 *
 * Table: prescriptions
 * +----+----------+-----------+-----------+-------+------------+
 * | id | doctorId | patientId | diagnosis | notes | createdDate|
 * +----+----------+-----------+-----------+-------+------------+
 * | 1  |    2     | PAT-ABC123| Fever     | Rest  | 2024-01-15 |
 * +----+----------+-----------+-----------+-------+------------+
 */

@Entity
@Table(name = "prescriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Which doctor created this prescription
    @Column(nullable = false)
    private Long doctorId;

    // For which patient (patientId like PAT-ABC123)
    @Column(nullable = false)
    private String patientId;

    // What is the diagnosis
    private String diagnosis;
    // "Viral Fever", "Common Cold", "Diabetes", etc.

    // Extra notes from doctor
    private String notes;
    // "Take rest for 3 days", "Avoid cold food"

    // When was prescription created
    @Column(nullable = false)
    private String createdDate;
    // "2024-01-15" format

    // Is prescription still active
    private String status;
    // "ACTIVE", "COMPLETED"
}