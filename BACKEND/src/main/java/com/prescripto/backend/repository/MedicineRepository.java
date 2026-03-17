package com.prescripto.backend.repository;

import com.prescripto.backend.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    // Ek prescription ki saari medicines
    List<Medicine> findByPrescriptionId(Long prescriptionId);

    // Aaj ki active medicines (date range me)
    // startDate <= today AND endDate >= today
    List<Medicine> findByStartDateLessThanEqualAndEndDateGreaterThanEqual(String today, String today2);
}