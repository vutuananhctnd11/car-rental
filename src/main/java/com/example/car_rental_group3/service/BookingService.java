package com.example.car_rental_group3.service;

import com.example.car_rental_group3.dto.request.BookingRequest;
import com.example.car_rental_group3.dto.response.BookingDetailResponse;
import com.example.car_rental_group3.dto.response.BookingResponse;
import com.example.car_rental_group3.entity.Booking;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BookingService {
    Booking createBooking(BookingRequest bookingRequest);
    List<BookingResponse> getUserBookings(int userId, Pageable pageable);
    BookingDetailResponse getBookingDetails(int bookingId);
    int getTotalUserBookings(int userId);
}
