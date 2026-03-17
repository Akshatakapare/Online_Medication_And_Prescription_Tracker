package com.prescripto.backend.controller;

import com.prescripto.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * AUTH CONTROLLER
 * ================
 * Handles: /auth/register, /auth/login
 */

@RestController
@RequestMapping("/api/prescripto/v1/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;


    // POST /api/prescripto/v1/auth/register
    @PostMapping("/register")
    public String register(@RequestBody Map<String, Object> data) {
        return authService.register(data);
    }


    // POST /api/prescripto/v1/auth/login
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> data) {
        return authService.login(data.get("email"), data.get("password"));
    }
}