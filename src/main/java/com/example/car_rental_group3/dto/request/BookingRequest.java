package com.example.car_rental_group3.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingRequest {
    int userId;
    int carId;
    LocalDate startDateTime;
    LocalDate endDateTime;
    String paymentMethod;
    String renterFullName;
    String renterPhone;
    String renterEmail;
    String renterNationalId;
    String driverFullName;
    String driverPhone;
    String driverEmail;
    String driverNationalId;
    String driverLicense;
    boolean differentDriver;

    Integer totalMoney;
}

