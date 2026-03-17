package com.prescripto.backend.service;

import com.prescripto.backend.entity.*;
import com.prescripto.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * DROPDOWN SERVICE
 * =================
 * Dropdown data prepare karo
 */

@Service
public class DropdownService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private MedicineMasterRepository medicineMasterRepository;


    /**
     * PATIENTS DROPDOWN
     * Format: "PAT-ABC123 - John Doe"
     */
    public List<Map<String, Object>> getPatientsForDropdown() {

        // Step 1: Saare patients lao
        List<User> users = userRepository.findByRole("PATIENT");
        List<Map<String, Object>> result = new ArrayList<>();

        // Step 2: Har patient ka data prepare karo
        for (User user : users) {

            // Patient table se patientId lao
            Patient patient = patientRepository.findByUserId(user.getId());

            if (patient != null) {
                Map<String, Object> item = new HashMap<>();

                item.put("id", user.getId());
                item.put("patientId", patient.getPatientId());
                item.put("fullName", user.getFullName());
                item.put("phone", user.getPhone());

                // Dropdown me dikhne wala text
                // "PAT-ABC123 - John Doe"
                item.put("label", patient.getPatientId() + " - " + user.getFullName());

                result.add(item);
            }
        }

        return result;
    }


    /**
     * MEDICINES DROPDOWN
     * Active medicines from medicine_master
     */
    public List<Map<String, Object>> getMedicinesForDropdown() {

        // Only active medicines
        List<MedicineMaster> medicines = medicineMasterRepository.findByIsActiveTrue();
        List<Map<String, Object>> result = new ArrayList<>();

        for (MedicineMaster med : medicines) {
            Map<String, Object> item = new HashMap<>();

            item.put("id", med.getId());
            item.put("name", med.getName());
            item.put("category", med.getCategory());
            item.put("defaultDosage", med.getDefaultDosage());
            item.put("stock", med.getStockQuantity());

            // Low stock warning
            item.put("isLowStock", med.getStockQuantity() <= med.getMinStockLevel());

            // Label for dropdown
            item.put("label", med.getName() + " (" + med.getCategory() + ")");

            result.add(item);
        }

        return result;
    }


    /**
     * MEDICINE CATEGORIES
     * Unique categories list
     */
    public List<String> getMedicineCategories() {
        List<MedicineMaster> medicines = medicineMasterRepository.findByIsActiveTrue();

        // Set = unique values only
        Set<String> categories = new HashSet<>();

        for (MedicineMaster med : medicines) {
            if (med.getCategory() != null) {
                categories.add(med.getCategory());
            }
        }

        // Convert to sorted list
        List<String> result = new ArrayList<>(categories);
        Collections.sort(result);

        return result;
    }
}