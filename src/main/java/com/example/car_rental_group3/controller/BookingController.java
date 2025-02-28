package com.example.car_rental_group3.controller;

import com.example.car_rental_group3.dto.request.BookingRequest;
import com.example.car_rental_group3.dto.request.BookingViewRequest;
import com.example.car_rental_group3.dto.response.ApiPageableResponse;
import com.example.car_rental_group3.dto.response.ApiResponse;
import com.example.car_rental_group3.dto.response.BookingResponse;
import com.example.car_rental_group3.entity.Booking;
import com.example.car_rental_group3.service.BookingService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/booking")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingController {
    BookingService bookingService;

    @PostMapping("/create")
    public ApiResponse createBooking(@RequestBody BookingRequest bookingRequest) {
        Booking result = bookingService.createBooking(bookingRequest);
        if (result == null) return ApiResponse.builder()
                .success(false)
                .message("Failed to create booking. Please check your information.")
                .build();
        return ApiResponse.builder()
                .success(true)
                .data(result)
                .message("Booking created successfully!")
                .build();
    }

    @PostMapping("/view")
    public ApiPageableResponse getUserBookings(@RequestBody BookingViewRequest bookingViewRequest) {
        Pageable pageable = PageRequest.of(bookingViewRequest.getPage()-1, bookingViewRequest.getLimit());
        int totalPage = (int) Math.ceil(bookingService.getTotalUserBookings(bookingViewRequest.getUsId())/bookingViewRequest.getLimit());
        List<BookingResponse> bookings = bookingService.getUserBookings(bookingViewRequest.getUsId(), pageable);
        if (bookings.isEmpty()) {
            return ApiPageableResponse.builder()
                    .success(false)
                    .message("You don't have any bookings!")
                    .build();
        }
        return ApiPageableResponse.builder()
                .success(true)
                .limit(bookingViewRequest.getLimit())
                .page(bookingViewRequest.getPage())
                .totalPage(totalPage==0 ? 1 : totalPage)
                .data(bookings)
                .build();
    }

    @GetMapping("/{bookingId}")
    public ApiResponse getBookingDetails(@PathVariable int bookingId) {
        return ApiResponse.builder()
                .success(true)
                .data(bookingService.getBookingDetails(bookingId))
                .build();
    }
}
