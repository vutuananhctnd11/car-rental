package com.example.car_rental_group3.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UpdateUserRequest {
    private String name;
    private String phoneNo;
    private String email;
    private String dateOfBirth;
    private String nationalIdNo;
    private String address;
    private String drivingLicense;
}
