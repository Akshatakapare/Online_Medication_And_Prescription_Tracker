package com.prescripto.backend.controller;

import com.prescripto.backend.service.DropdownService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * DROPDOWN CONTROLLER
 * ====================
 * Prescription create karte waqt dropdowns ke liye data
 * - Patients list (Patient ID + Name)
 * - Medicines list (from medicine_master)
 */

@RestController
@RequestMapping("/api/prescripto/v1/dropdown")
@CrossOrigin(origins = "*")
public class DropdownController {

    @Autowired
    private DropdownService dropdownService;


    /**
     * GET PATIENTS FOR DROPDOWN
     * Doctor ko patients select karne ke liye
     * GET /api/prescripto/v1/dropdown/patients
     */
    @GetMapping("/patients")
    public List<Map<String, Object>> getPatientsDropdown() {
        return dropdownService.getPatientsForDropdown();
    }


    /**
     * GET MEDICINES FOR DROPDOWN
     * Doctor ko medicines select karne ke liye
     * GET /api/prescripto/v1/dropdown/medicines
     */
    @GetMapping("/medicines")
    public List<Map<String, Object>> getMedicinesDropdown() {
        return dropdownService.getMedicinesForDropdown();
    }


    /**
     * GET MEDICINE CATEGORIES
     * Filter ke liye categories
     * GET /api/prescripto/v1/dropdown/categories
     */
    @GetMapping("/categories")
    public List<String> getMedicineCategories() {
        return dropdownService.getMedicineCategories();
    }
}