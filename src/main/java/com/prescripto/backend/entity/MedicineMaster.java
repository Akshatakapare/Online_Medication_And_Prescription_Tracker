package com.prescripto.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * MEDICINE MASTER ENTITY
 * =======================
 * Database me available medicines ki list
 * Admin add karega, Doctor select karega
 */

@Entity
@Table(name = "medicine_master")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicineMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Medicine name (unique)
    @Column(nullable = false, unique = true)
    private String name;

    // Category - Fever, Antibiotic, etc.
    private String category;

    // Default dosage - 500mg, 10ml
    private String defaultDosage;

    // Company name
    private String manufacturer;

    // Current stock
    @Column(nullable = false)
    private Integer stockQuantity;

    // Minimum stock level (alert below this)
    @Column(nullable = false)
    private Integer minStockLevel;

    // Price per unit
    private Double price;

    // Active or not
    @Column(nullable = false)
    private Boolean isActive;
}