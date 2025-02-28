package com.example.car_rental_group3.service.impl;

import com.example.car_rental_group3.dto.request.BookingRequest;
import com.example.car_rental_group3.dto.response.BookingDetailResponse;
import com.example.car_rental_group3.dto.response.BookingResponse;
import com.example.car_rental_group3.entity.Booking;
import com.example.car_rental_group3.entity.Car;
import com.example.car_rental_group3.entity.User;
import com.example.car_rental_group3.mapper.BookingMapper;
import com.example.car_rental_group3.repository.BookingRepository;
import com.example.car_rental_group3.repository.CarRepository;
import com.example.car_rental_group3.repository.UserRepository;
import com.example.car_rental_group3.service.BookingService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingServiceImpl implements BookingService {

    BookingRepository bookingRepository;
    UserRepository userRepository;
    CarRepository carRepository;
    BookingMapper bookingMapper;

    @Override
    public Booking createBooking(BookingRequest bookingRequest) {
        // Validate request
        if (bookingRequest.getCarId() == 0 || bookingRequest.getUserId() == 0
                || bookingRequest.getStartDateTime() == null || bookingRequest.getEndDateTime() == null) {
            return null;
        }

        // Get user and car
        User user = userRepository.findById(bookingRequest.getUserId()).orElse(null);
        Car car = carRepository.findById(bookingRequest.getCarId()).orElse(null);

        if (user == null || car == null) {
            return null;
        }

        // Create new booking
        Booking booking = new Booking();
        booking.setStartDateTime(bookingRequest.getStartDateTime());
        booking.setEndDateTime(bookingRequest.getEndDateTime());
        booking.setPaymentMethod(bookingRequest.getPaymentMethod());
        booking.setStatus("PENDING");
        booking.setUser(user);

        List<Car> cars = new ArrayList<>();
        cars.add(car);
        booking.setCars(cars);

        return bookingRepository.save(booking);
    }

    @Override
    @Transactional
    public List<BookingResponse> getUserBookings(int userId, Pageable pageable) {
        List<Booking> bookings = bookingRepository.findByUserId(userId, pageable);

        List<BookingResponse> bookingResponses = new ArrayList<>();

        for(Booking booking : bookings){
            BookingResponse bookingResponse = new BookingResponse();

            bookingResponse = bookingMapper.toBookingResponse(booking);
            bookingMapper.afterMapping(bookingResponse, booking);

            bookingResponses.add(bookingResponse);
        }

//        return bookings.stream()
//                .map(bookingMapper::toBookingResponse)
//                .collect(Collectors.toList());
        return bookingResponses;
    }

    @Override
    public BookingDetailResponse getBookingDetails(int bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking == null) {
            return null;
        }
        return bookingMapper.toBookingDetailResponse(booking);
    }

    @Override
    public int getTotalUserBookings(int userId) {
        return bookingRepository.countByUserId(userId);
    }
}
