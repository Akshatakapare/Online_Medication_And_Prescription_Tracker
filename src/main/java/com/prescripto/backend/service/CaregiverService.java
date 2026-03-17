package com.prescripto.backend.service;

import com.prescripto.backend.entity.Caregiver;
import com.prescripto.backend.entity.Patient;
import com.prescripto.backend.entity.User;
import com.prescripto.backend.repository.CaregiverRepository;
import com.prescripto.backend.repository.PatientRepository;
import com.prescripto.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * CAREGIVER SERVICE
 * ==================
 * All caregiver related operations
 * Includes patient-caregiver mapping
 */

@Service
public class CaregiverService {

    @Autowired
    private CaregiverRepository caregiverRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;


    /**
     * GET ALL CAREGIVERS
     */
    public List<Map<String, Object>> getAllCaregivers() {

        List<User> users = userRepository.findByRole("CAREGIVER");
        List<Map<String, Object>> result = new ArrayList<>();

        for (User user : users) {
            Map<String, Object> data = new HashMap<>();
            data.put("id", user.getId());
            data.put("fullName", user.getFullName());
            data.put("email", user.getEmail());
            data.put("phone", user.getPhone());

            Caregiver caregiver = caregiverRepository.findByUserId(user.getId());
            data.put("caregiverInfo", caregiver);

            result.add(data);
        }

        return result;
    }


    /**
     * GET CAREGIVER BY ID
     */
    public Map<String, Object> getCaregiverById(Long id) {

        User user = userRepository.findById(id).orElse(null);

        if (user == null || !"CAREGIVER".equals(user.getRole())) {
            return null;
        }

        Map<String, Object> data = new HashMap<>();
        data.put("id", user.getId());
        data.put("fullName", user.getFullName());
        data.put("email", user.getEmail());
        data.put("phone", user.getPhone());
        data.put("city", user.getCity());

        Caregiver caregiver = caregiverRepository.findByUserId(user.getId());
        data.put("caregiverInfo", caregiver);

        // Add linked patient info
        if (caregiver != null && caregiver.getAssignedPatientId() != null) {
            Patient patient = patientRepository.findByPatientId(caregiver.getAssignedPatientId());
            if (patient != null) {
                User patientUser = userRepository.findById(patient.getUserId()).orElse(null);
                if (patientUser != null) {
                    Map<String, Object> linkedData = new HashMap<>();
                    linkedData.put("fullName", patientUser.getFullName());
                    linkedData.put("phone", patientUser.getPhone());
                    linkedData.put("patientId", patient.getPatientId());
                    data.put("linkedPatient", linkedData);
                }
            }
        }

        return data;
    }


    /**
     * GET CAREGIVERS OF A PATIENT
     */
    public List<Map<String, Object>> getCaregiversOfPatient(String patientId) {

        List<Caregiver> caregivers = caregiverRepository.findByAssignedPatientId(patientId);
        List<Map<String, Object>> result = new ArrayList<>();

        for (Caregiver caregiver : caregivers) {
            User user = userRepository.findById(caregiver.getUserId()).orElse(null);
            if (user != null) {
                Map<String, Object> data = new HashMap<>();
                data.put("id", user.getId());
                data.put("fullName", user.getFullName());
                data.put("phone", user.getPhone());
                data.put("caregiverInfo", caregiver);
                result.add(data);
            }
        }

        return result;
    }


    /**
     * DELETE CAREGIVER
     */
    public String deleteCaregiver(Long id) {

        User user = userRepository.findById(id).orElse(null);

        if (user == null || !"CAREGIVER".equals(user.getRole())) {
            return "Caregiver not found!";
        }

        Caregiver caregiver = caregiverRepository.findByUserId(id);
        if (caregiver != null) {
            caregiverRepository.delete(caregiver);
        }

        userRepository.deleteById(id);

        return "Caregiver deleted!";
    }
}