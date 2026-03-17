package com.prescripto.backend.repository;

import com.prescripto.backend.entity.MedicationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicationLogRepository extends JpaRepository<MedicationLog, Long> {

    // Patient ki ek din ki saari logs
    List<MedicationLog> findByPatientIdAndDate(String patientId, String date);

    // Ek medicine ki ek din ki log
    MedicationLog findByMedicineIdAndDateAndTiming(Long medicineId, String date, String timing);

    // Patient ki saari logs
    List<MedicationLog> findByPatientId(String patientId);

    // Patient ki ek medicine ki saari logs
    List<MedicationLog> findByMedicineIdAndPatientId(Long medicineId, String patientId);
}