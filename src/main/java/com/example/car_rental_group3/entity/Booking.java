package com.example.car_rental_group3.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity(name = "booking")
public class Booking extends Base{

	LocalDate startDateTime;
	LocalDate endDateTime;
	String paymentMethod;
	String status;
	
	@ManyToOne
	@JoinColumn(name = "customer_id")
	User user;
	
	@ManyToMany
	@JoinTable(name = "bookingcar",
			joinColumns = @JoinColumn(name ="booking_id", nullable = false),
			inverseJoinColumns = @JoinColumn(name = "car_id", nullable = false)
	)
	@JsonIgnore
	List<Car> cars = new ArrayList<>();
}
