package com.example.demo.Repository;

import com.example.demo.Model.PatientAppointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PatientAppointmentRepository extends JpaRepository<PatientAppointment, Long> {
    List<PatientAppointment> findByStatus(String status);
    List<PatientAppointment> findByPatient_PatientID(Long patientID);
    List<PatientAppointment> findByDoctor_DoctorID(Long doctorID);
    List<PatientAppointment> findByAppointmentDate(LocalDate date);
}