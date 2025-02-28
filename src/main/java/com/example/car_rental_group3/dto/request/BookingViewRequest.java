package com.example.car_rental_group3.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingViewRequest {
    Integer usId;
    int limit;
    int page;
}
