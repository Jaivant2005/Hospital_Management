package com.example.demo.Controller;

import com.example.demo.Model.PatientAppointment;
import com.example.demo.Repository.PatientAppointmentRepository;
import com.example.demo.Repository.DoctorRepository;
import com.example.demo.Repository.PatientRegRepository;
import com.example.demo.Model.Doctor;
import com.example.demo.Model.PatientReg;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.time.LocalDate;
@CrossOrigin(origins = "http://localhost:5173") 
@RestController
@RequestMapping("/api")
public class PatientAppointmentController {

    @Autowired
    private PatientAppointmentRepository appointmentRepository;

    @Autowired
    private PatientRegRepository patientRegRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @GetMapping("/appointments/{id}")
    public ResponseEntity<PatientAppointment> getAppointmentById(@PathVariable("id") Long id) {
        Optional<PatientAppointment> appointment = appointmentRepository.findById(id);
        return appointment.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                          .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/appointments")
    public ResponseEntity<PatientAppointment> createAppointment(@RequestBody PatientAppointment appointment) {
        try {
            if (appointment.getPatient() == null || appointment.getDoctor() == null) {
                return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
            }

            Optional<PatientReg> patientOpt = patientRegRepository.findById(appointment.getPatient().getPatientID());
            Optional<Doctor> doctorOpt = doctorRepository.findById(appointment.getDoctor().getDoctorID());

            if (patientOpt.isEmpty() || doctorOpt.isEmpty()) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }

            appointment.setPatient(patientOpt.get());
            appointment.setDoctor(doctorOpt.get());
            appointment.setStatus("Scheduled");
            appointment.setCreatedAt(appointment.getCreatedAt() != null ? appointment.getCreatedAt() : java.time.LocalDateTime.now());

            PatientAppointment saved = appointmentRepository.save(appointment);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/appointments/{id}")
    public ResponseEntity<PatientAppointment> updateAppointment(@PathVariable("id") Long id, @RequestBody PatientAppointment appointment) {
        Optional<PatientAppointment> existingOpt = appointmentRepository.findById(id);
        if (existingOpt.isPresent()) {
            PatientAppointment existing = existingOpt.get();
            existing.setAppointmentDate(appointment.getAppointmentDate());
            existing.setAppointmentTime(appointment.getAppointmentTime());
            existing.setReason(appointment.getReason());
            existing.setStatus(appointment.getStatus());
            if (appointment.getPatient() != null) {
                patientRegRepository.findById(appointment.getPatient().getPatientID())
                    .ifPresent(existing::setPatient);
            }
            if (appointment.getDoctor() != null) {
                doctorRepository.findById(appointment.getDoctor().getDoctorID())
                    .ifPresent(existing::setDoctor);
            }

            return new ResponseEntity<>(appointmentRepository.save(existing), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/appointments/{id}")
    public ResponseEntity<HttpStatus> deleteAppointment(@PathVariable("id") Long id) {
        try {
            appointmentRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/appointments")
    public ResponseEntity<HttpStatus> deleteAllAppointments() {
        try {
            appointmentRepository.deleteAll();
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<PatientAppointment>> getAllAppointments(
            @RequestParam(required = false) LocalDate date) {
        try {
            List<PatientAppointment> appointments = new ArrayList<>();
            if (date == null) {
                appointmentRepository.findAll().forEach(appointments::add);
            } else {
                appointmentRepository.findByAppointmentDate(date).forEach(appointments::add);
            }

            if (appointments.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(appointments, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
