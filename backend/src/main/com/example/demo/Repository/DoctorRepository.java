package com.example.demo.Repository;

import com.example.demo.Model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findByDepartment(String department);
    List<Doctor> findByGender(String gender);
    List<Doctor> findByAvailabilityContaining(String keyword);
    Doctor findByEmail(String email);
}
