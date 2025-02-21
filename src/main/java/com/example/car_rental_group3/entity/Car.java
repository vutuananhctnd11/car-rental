package com.example.car_rental_group3.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
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

	@ManyToOne
	@JoinColumn(name = "car_owner_id")
	User user;
}
