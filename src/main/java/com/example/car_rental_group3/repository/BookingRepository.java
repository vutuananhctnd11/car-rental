package com.example.car_rental_group3.repository;

import com.example.car_rental_group3.entity.Booking;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Integer> {
    List<Booking> findByUserId(int userId, Pageable pageable);
    int countByUserId(int userId);
}
