package com.example.car_rental_group3.mapper;

import com.example.car_rental_group3.dto.response.BookingDetailResponse;
import com.example.car_rental_group3.dto.response.BookingResponse;
import com.example.car_rental_group3.entity.Booking;
import com.example.car_rental_group3.entity.Car;
import org.mapstruct.*;

import java.time.temporal.ChronoUnit;

@Mapper(componentModel = "spring")
public interface BookingMapper {
    BookingResponse toBookingResponse(Booking booking);
//    @AfterMapping
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    default void afterMapping(@MappingTarget BookingResponse response, Booking booking) {
        if (booking.getCars() != null && !booking.getCars().isEmpty()) {
            Car car = booking.getCars().get(0);
            response.setCarName(car.getName());
            if (car.getImages() != null && !car.getImages().isEmpty()) {
                response.setCarImage(car.getImages().split(", ")[0]);
            }

            // Calculate total price
            long days = ChronoUnit.DAYS.between(booking.getStartDateTime(), booking.getEndDateTime());
            response.setTotalPrice(car.getBaseprice() * days);

            response.setBasePrice(car.getBaseprice());
            response.setDeposit(car.getDeposit());
            response.setNumberOfDays(days);
        }
    }

    BookingDetailResponse toBookingDetailResponse(Booking booking);
    @AfterMapping
    default void afterDetailMapping(@MappingTarget BookingDetailResponse response, Booking booking) {
        if (booking.getCars() != null && !booking.getCars().isEmpty()) {
            Car car = booking.getCars().get(0);
            response.setCarName(car.getName());
            if (car.getImages() != null && !car.getImages().isEmpty()) {
                response.setCarImage(car.getImages().split(", ")[0]);
            }

            response.setPricePerDay(car.getBaseprice());
            response.setDeposit(car.getDeposit());

            // Calculate number of days and total price
            long days = ChronoUnit.DAYS.between(booking.getStartDateTime(), booking.getEndDateTime());
            response.setNumberOfDays((int) days);
            response.setTotalPrice(car.getBaseprice() * days);
        }
    }
}
