package com.example.demo.Repository;

import com.example.demo.Model.PatientReg;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRegRepository extends JpaRepository<PatientReg, Long> {
    List<PatientReg> findByFirstName(String firstName);
}