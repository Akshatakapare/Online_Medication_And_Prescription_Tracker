package com.prescripto.backend.controller;

import com.prescripto.backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * ADMIN CONTROLLER
 * =================
 * Admin ke saare APIs yahan hain
 *
 * Features:
 * - Admin login (hardcoded)
 * - View all users (patients/doctors/caregivers)
 * - View user details
 * - Delete user
 */

@RestController
@RequestMapping("/api/prescripto/v1/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;


    /**
     * ADMIN LOGIN
     * Hardcoded credentials check karo
     * POST /api/prescripto/v1/admin/login
     */
    @PostMapping("/login")
    public Map<String, Object> adminLogin(@RequestBody Map<String, String> data) {
        String email = data.get("email");
        String password = data.get("password");
        return adminService.adminLogin(email, password);
    }


    /**
     * GET DASHBOARD STATS
     * Total counts of users
     * GET /api/prescripto/v1/admin/stats
     */
    @GetMapping("/stats")
    public Map<String, Object> getDashboardStats() {
        return adminService.getDashboardStats();
    }


    /**
     * GET ALL PATIENTS
     * GET /api/prescripto/v1/admin/patients
     */
    @GetMapping("/patients")
    public List<Map<String, Object>> getAllPatients() {
        return adminService.getAllPatients();
    }


    /**
     * GET ALL DOCTORS
     * GET /api/prescripto/v1/admin/doctors
     */
    @GetMapping("/doctors")
    public List<Map<String, Object>> getAllDoctors() {
        return adminService.getAllDoctors();
    }


    /**
     * GET ALL CAREGIVERS
     * GET /api/prescripto/v1/admin/caregivers
     */
    @GetMapping("/caregivers")
    public List<Map<String, Object>> getAllCaregivers() {
        return adminService.getAllCaregivers();
    }


    /**
     * GET USER DETAILS BY ID
     * GET /api/prescripto/v1/admin/user/5
     */
    @GetMapping("/user/{id}")
    public Map<String, Object> getUserDetails(@PathVariable Long id) {
        return adminService.getUserDetails(id);
    }


    /**
     * DELETE USER
     * DELETE /api/prescripto/v1/admin/user/5
     */
    @DeleteMapping("/user/{id}")
    public String deleteUser(@PathVariable Long id) {
        return adminService.deleteUser(id);
    }
}