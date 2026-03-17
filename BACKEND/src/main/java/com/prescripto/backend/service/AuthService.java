package com.prescripto.backend.service;

import com.prescripto.backend.entity.*;
import com.prescripto.backend.repository.*;
import com.prescripto.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * AUTH SERVICE
 * =============
 * Handles: Register & Login
 * Sirf authentication related logic yahan hai
 */

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private CaregiverRepository caregiverRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;


    /**
     * REGISTER
     * Role ke hisaab se different tables me save
     */
    public String register(Map<String, Object> data) {

        String email = (String) data.get("email");
        String role = (String) data.get("role");

        // Email check
        if (userRepository.existsByEmail(email)) {
            return "Email already registered!";
        }

        // Validations
        if ("PATIENT".equals(role)) {
            String patientId = (String) data.get("patientId");
            if (patientId != null && patientRepository.existsByPatientId(patientId)) {
                return "Patient ID already exists!";
            }
        }

        if ("DOCTOR".equals(role)) {
            String license = (String) data.get("licenseNumber");
            if (license != null && doctorRepository.existsByLicenseNumber(license)) {
                return "License number already registered!";
            }
        }

        if ("CAREGIVER".equals(role)) {
            String assignedId = (String) data.get("assignedPatientId");
            if (assignedId != null && !assignedId.isEmpty()) {
                if (!patientRepository.existsByPatientId(assignedId)) {
                    return "Invalid Patient ID!";
                }
            }
        }

        // Create User
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode((String) data.get("password")));
        user.setRole(role);
        user.setFullName((String) data.get("fullName"));
        user.setPhone((String) data.get("phone"));
        user.setGender((String) data.get("gender"));
        user.setDateOfBirth((String) data.get("dateOfBirth"));
        user.setAddress((String) data.get("address"));
        user.setCity((String) data.get("city"));
        user.setState((String) data.get("state"));
        user.setPincode((String) data.get("pincode"));

        User savedUser = userRepository.save(user);

        // Save role specific data
        if ("PATIENT".equals(role)) {
            Patient patient = new Patient();
            patient.setUserId(savedUser.getId());
            patient.setPatientId((String) data.get("patientId"));
            patient.setBloodGroup((String) data.get("bloodGroup"));
            patient.setAllergies((String) data.get("allergies"));
            patient.setEmergencyContactName((String) data.get("emergencyContactName"));
            patient.setEmergencyContactPhone((String) data.get("emergencyContactPhone"));
            patientRepository.save(patient);
        }

        if ("DOCTOR".equals(role)) {
            Doctor doctor = new Doctor();
            doctor.setUserId(savedUser.getId());
            doctor.setSpecialization((String) data.get("specialization"));
            doctor.setQualification((String) data.get("qualification"));
            doctor.setLicenseNumber((String) data.get("licenseNumber"));
            doctor.setHospitalName((String) data.get("hospitalName"));

            if (data.get("experienceYears") != null) {
                doctor.setExperienceYears(Integer.parseInt(data.get("experienceYears").toString()));
            }
            if (data.get("consultationFee") != null) {
                doctor.setConsultationFee(Double.parseDouble(data.get("consultationFee").toString()));
            }
            doctorRepository.save(doctor);
        }

        if ("CAREGIVER".equals(role)) {
            Caregiver caregiver = new Caregiver();
            caregiver.setUserId(savedUser.getId());
            caregiver.setRelationWithPatient((String) data.get("relationWithPatient"));
            caregiver.setAssignedPatientId((String) data.get("assignedPatientId"));
            caregiverRepository.save(caregiver);
        }

        return "Registration successful!";
    }


    /**
     * LOGIN
     * Returns user + role specific data + token
     */
    public Map<String, Object> login(String email, String password) {

        Map<String, Object> response = new HashMap<>();

        User user = userRepository.findByEmail(email);

        if (user == null) {
            response.put("error", "User not found!");
            return response;
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            response.put("error", "Wrong password!");
            return response;
        }

        // Generate token
        String token = jwtUtil.generateToken(email);

        // Build response
        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("fullName", user.getFullName());
        response.put("role", user.getRole());
        response.put("phone", user.getPhone());
        response.put("gender", user.getGender());
        response.put("dateOfBirth", user.getDateOfBirth());
        response.put("address", user.getAddress());
        response.put("city", user.getCity());
        response.put("state", user.getState());
        response.put("pincode", user.getPincode());
        response.put("token", token);

        // Add role specific data
        if ("PATIENT".equals(user.getRole())) {
            Patient patient = patientRepository.findByUserId(user.getId());
            response.put("patientInfo", patient);
        }

        if ("DOCTOR".equals(user.getRole())) {
            Doctor doctor = doctorRepository.findByUserId(user.getId());
            response.put("doctorInfo", doctor);
        }

        if ("CAREGIVER".equals(user.getRole())) {
            Caregiver caregiver = caregiverRepository.findByUserId(user.getId());
            response.put("caregiverInfo", caregiver);

            // Linked patient info
            if (caregiver != null && caregiver.getAssignedPatientId() != null) {
                Patient linkedPatient = patientRepository.findByPatientId(caregiver.getAssignedPatientId());
                if (linkedPatient != null) {
                    User patientUser = userRepository.findById(linkedPatient.getUserId()).orElse(null);
                    if (patientUser != null) {
                        Map<String, Object> linkedData = new HashMap<>();
                        linkedData.put("fullName", patientUser.getFullName());
                        linkedData.put("phone", patientUser.getPhone());
                        linkedData.put("patientId", linkedPatient.getPatientId());
                        linkedData.put("bloodGroup", linkedPatient.getBloodGroup());
                        response.put("linkedPatient", linkedData);
                    }
                }
            }
        }

        return response;
    }
}