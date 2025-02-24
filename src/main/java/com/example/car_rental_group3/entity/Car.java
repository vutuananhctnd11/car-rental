package com.example.car_rental_group3.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity(name = "car")
public class Car extends Base{

	String name;
	String licensePlate;
	String brand;
	String model;
	String color;
	int numberOfSeats;
	int productionYears;
	String transmissionType;
	String fuelType;
	double mileage;
	String fuelConsumption;
	double baseprice;
	double deposit;
	String address;
	String description;
	String additionalFunctions;
	String termOfUse;
	String images;
	String status;

	@ManyToOne
	@JoinColumn(name = "car_owner_id")
	User user;
	
	@ManyToMany
	@JoinTable(name = "bookingcar", 
		joinColumns = @JoinColumn(name ="car_id"),
		inverseJoinColumns = @JoinColumn(name = "booking_id")
	)
	@JsonIgnore
	List<Booking> bookings;
}
