package com.example.car_rental_group3.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingResponse {
    int id;
    String carName;
    String carImage;
    LocalDate startDateTime;
    LocalDate endDateTime;
    String status;
    double totalPrice;
    double basePrice;
    double deposit;
    long numberOfDays;
}
