package com.prescripto.backend.service;

import com.prescripto.backend.entity.Patient;
import com.prescripto.backend.entity.User;
import com.prescripto.backend.repository.PatientRepository;
import com.prescripto.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * PATIENT SERVICE
 * ================
 * All patient related operations
 */

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;


    /**
     * GET ALL PATIENTS
     */
    public List<Map<String, Object>> getAllPatients() {

        List<User> users = userRepository.findByRole("PATIENT");
        List<Map<String, Object>> result = new ArrayList<>();

        for (User user : users) {
            Map<String, Object> data = new HashMap<>();
            data.put("id", user.getId());
            data.put("fullName", user.getFullName());
            data.put("email", user.getEmail());
            data.put("phone", user.getPhone());
            data.put("city", user.getCity());

            Patient patient = patientRepository.findByUserId(user.getId());
            data.put("patientInfo", patient);

            result.add(data);
        }

        return result;
    }


    /**
     * GET PATIENT BY ID
     */
    public Map<String, Object> getPatientById(Long id) {

        User user = userRepository.findById(id).orElse(null);

        if (user == null || !"PATIENT".equals(user.getRole())) {
            return null;
        }

        Map<String, Object> data = new HashMap<>();
        data.put("id", user.getId());
        data.put("fullName", user.getFullName());
        data.put("email", user.getEmail());
        data.put("phone", user.getPhone());
        data.put("gender", user.getGender());
        data.put("dateOfBirth", user.getDateOfBirth());
        data.put("address", user.getAddress());
        data.put("city", user.getCity());
        data.put("state", user.getState());
        data.put("pincode", user.getPincode());

        Patient patient = patientRepository.findByUserId(user.getId());
        data.put("patientInfo", patient);

        return data;
    }


    /**
     * GET PATIENT BY PATIENT_ID
     * For caregiver linking verification
     */
    public Map<String, Object> getPatientByPatientId(String patientId) {

        Patient patient = patientRepository.findByPatientId(patientId);

        if (patient == null) {
            return null;
        }

        User user = userRepository.findById(patient.getUserId()).orElse(null);

        if (user == null) {
            return null;
        }

        Map<String, Object> data = new HashMap<>();
        data.put("id", user.getId());
        data.put("fullName", user.getFullName());
        data.put("phone", user.getPhone());
        data.put("city", user.getCity());
        data.put("patientInfo", patient);

        return data;
    }


    /**
     * DELETE PATIENT
     */
    public String deletePatient(Long id) {

        User user = userRepository.findById(id).orElse(null);

        if (user == null || !"PATIENT".equals(user.getRole())) {
            return "Patient not found!";
        }

        Patient patient = patientRepository.findByUserId(id);
        if (patient != null) {
            patientRepository.delete(patient);
        }

        userRepository.deleteById(id);

        return "Patient deleted!";
    }
}