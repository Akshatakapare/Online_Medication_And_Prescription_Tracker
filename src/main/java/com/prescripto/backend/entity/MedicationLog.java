package com.prescripto.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * MEDICATION LOG ENTITY
 * ======================
 * Tracks if patient took medicine or missed it
 * Each row = one dose (morning/evening/night) of one medicine on one day
 *
 * Table: medication_logs
 * +----+------------+-----------+------------+---------+--------+
 * | id | medicineId | patientId | date       | timing  | status |
 * +----+------------+-----------+------------+---------+--------+
 * | 1  |     1      | PAT-ABC123| 2024-01-15 | MORNING | TAKEN  |
 * | 2  |     2      | PAT-ABC123| 2024-01-15 | NIGHT   | MISSED |
 * +----+------------+-----------+------------+---------+--------+
 */

@Entity
@Table(name = "medication_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Which medicine
    @Column(nullable = false)
    private Long medicineId;

    // Which patient
    @Column(nullable = false)
    private String patientId;

    // Which date
    @Column(nullable = false)
    private String date;
    // "2024-01-15"

    // Which time slot
    @Column(nullable = false)
    private String timing;
    // "MORNING", "EVENING", "NIGHT"

    // Did patient take it or miss it
    @Column(nullable = false)
    private String status;
    // "TAKEN", "MISSED", "PENDING"
}