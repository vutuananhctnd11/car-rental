package com.example.car_rental_group3.dto.response;

import java.time.LocalDate;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingDetailResponse {
    int id;
    String carName;
    String carImage;
    double pricePerDay;
    LocalDate startDateTime;
    LocalDate endDateTime;
    int numberOfDays;
    double totalPrice;
    double deposit;
    String paymentMethod;
    String status;
    String renterFullName;
    String renterPhone;
    String renterEmail;
    String driverFullName;
    String driverPhone;
    String driverEmail;
}
