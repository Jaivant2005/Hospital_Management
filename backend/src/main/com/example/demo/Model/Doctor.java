package com.example.demo.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long doctorID;

    @Column(name = "FirstName", nullable = false)
    private String firstName;

    @Column(name = "LastName")
    private String lastName;

    @Column(name = "Gender")
    private String gender; 
    @Column(name = "Department")
    private String department;

    @Column(name = "ContactNumber")
    private String contactNumber;

    @Column(name = "Email")
    private String email;

    @Column(name = "Availability")
    private String availability; //mon-fri

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt = LocalDateTime.now();

    
    public Doctor() {}

    public Doctor(String firstName, String lastName, String gender, String department,
                  String contactNumber, String email, String availability) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.department = department;
        this.contactNumber = contactNumber;
        this.email = email;
        this.availability = availability;
        this.createdAt = LocalDateTime.now();
    }
    public Long getDoctorID() {
        return doctorID;
    }

    public void setDoctorID(Long doctorID) {
        this.doctorID = doctorID;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
