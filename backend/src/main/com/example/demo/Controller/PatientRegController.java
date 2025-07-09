package com.example.demo.Controller;

import com.example.demo.Model.PatientReg;
import com.example.demo.Repository.PatientRegRepository;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class PatientRegController {

    @Autowired
    private PatientRegRepository patientRegRepository;

    @GetMapping("/patients/{id}")
    public ResponseEntity<PatientReg> getPatientById(@PathVariable("id") long id) {
        Optional<PatientReg> patient = patientRegRepository.findById(id);
        return patient.map(value -> new ResponseEntity<>(value, HttpStatus.OK)) .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/patients")
    public ResponseEntity<PatientReg> createPatient(@RequestBody PatientReg patient) {
        try {
            PatientReg _patient = patientRegRepository.save(patient);
            return new ResponseEntity<>(_patient, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/patients/{id}")
    public ResponseEntity<PatientReg> updatePatient(@PathVariable("id") long id, @RequestBody PatientReg patient) {
        Optional<PatientReg> patientData = patientRegRepository.findById(id);
        if (patientData.isPresent()) {
            PatientReg _patient = patientData.get();
            _patient.setFirstName(patient.getFirstName());
            _patient.setLastName(patient.getLastName());
            _patient.setGender(patient.getGender());
            _patient.setDateOfBirth(patient.getDateOfBirth());
            _patient.setBloodGroup(patient.getBloodGroup());
            _patient.setContactNumber(patient.getContactNumber());
            _patient.setEmail(patient.getEmail());
            _patient.setAddress(patient.getAddress());

            return new ResponseEntity<>(patientRegRepository.save(_patient), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/patients/{id}")
    public ResponseEntity<HttpStatus> deletePatient(@PathVariable("id") long id) {
        try {
            patientRegRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/patients")
    public ResponseEntity<HttpStatus> deleteAllPatients() {
        try {
            patientRegRepository.deleteAll();
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/patients")
    public ResponseEntity<List<PatientReg>> getAllPatients(@RequestParam(required = false) String firstName) {
        try {
            List<PatientReg> patients = new ArrayList<>();
            if (firstName == null || firstName.isEmpty()) {
                patientRegRepository.findAll().forEach(patients::add);
            } else {
                patientRegRepository.findByFirstName(firstName).forEach(patients::add);
            }

            if (patients.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(patients, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
