package com.prescripto.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * APPOINTMENT ENTITY
 * ===================
 * Patient books appointment with Doctor
 */

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Doctor ID
    @Column(nullable = false)
    private Long doctorId;

    // Patient ID (PAT-ABC123)
    @Column(nullable = false)
    private String patientId;

    // Appointment date (2024-01-15)
    @Column(nullable = false)
    private String appointmentDate;

    // Time slot (10:00 AM, 2:30 PM)
    @Column(nullable = false)
    private String timeSlot;

    // Reason for visit
    private String reason;

    // Status: PENDING, CONFIRMED, COMPLETED, CANCELLED
    @Column(nullable = false)
    private String status;

    // Notes from doctor
    private String doctorNotes;

    // Created date
    private String createdDate;
}