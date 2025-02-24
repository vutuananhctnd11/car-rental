package com.example.car_rental_group3.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.car_rental_group3.entity.Car;

@Repository
public interface CarRepository extends JpaRepository<Car, Integer> {

	Page<Car> findAllByUserId (int carOwnerId, Pageable pageable);
	Page<Car> findAllByAddressContainingIgnoreCaseAndStatus(String address,String status, Pageable pageable);
}
