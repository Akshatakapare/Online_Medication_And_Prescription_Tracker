package com.prescripto.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * MEDICINE ENTITY
 * ================
 * Each medicine in a prescription
 * One prescription can have MANY medicines
 *
 * Table: medicines
 * +----+----------------+-----------+--------+----------+----------+-----------+
 * | id | prescriptionId | name      | dosage | timing   | duration |instructions|
 * +----+----------------+-----------+--------+----------+----------+-----------+
 * | 1  |       1        |Paracetamol| 500mg  | MORNING  | 5        |After food  |
 * | 2  |       1        |Cough Syrup| 10ml   | NIGHT    | 7        |Before sleep|
 * +----+----------------+-----------+--------+----------+----------+-----------+
 */

@Entity
@Table(name = "medicines")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Which prescription this medicine belongs to
    @Column(nullable = false)
    private Long prescriptionId;

    // Medicine name
    @Column(nullable = false)
    private String name;
    // "Paracetamol", "Amoxicillin", "Cough Syrup"

    // Dosage
    private String dosage;
    // "500mg", "10ml", "1 tablet"

    // When to take
    @Column(nullable = false)
    private String timing;
    // "MORNING", "EVENING", "NIGHT"
    // "MORNING_EVENING", "MORNING_NIGHT", "EVENING_NIGHT"
    // "MORNING_EVENING_NIGHT"

    // Duration in days
    private Integer durationDays;
    // 5, 7, 10, 30 days

    // Extra instructions
    private String instructions;
    // "After food", "Before food", "Empty stomach", "With warm water"

    // Start date (prescription date se start)
    private String startDate;

    // End date (start + duration)
    private String endDate;
}