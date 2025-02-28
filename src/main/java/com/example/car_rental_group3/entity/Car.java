package com.example.car_rental_group3.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

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
	
	@ManyToMany(mappedBy = "cars")
	@JsonIgnore
	List<Booking> bookings = new ArrayList<>();
}
