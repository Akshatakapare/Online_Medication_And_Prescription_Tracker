package com.prescripto.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * USER ENTITY
 * ===========
 * Common fields for all users (Patient/Doctor/Caregiver)
 * Used for authentication (login/register)
 *
 * Table: users
 */

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Auth fields
    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;  // PATIENT, DOCTOR, CAREGIVER

    // Common fields
    @Column(nullable = false)
    private String fullName;

    private String phone;
    private String gender;
    private String dateOfBirth;
    private String address;
    private String city;
    private String state;
    private String pincode;

    // Token (not saved in DB)
    @Transient
    private String token;
}