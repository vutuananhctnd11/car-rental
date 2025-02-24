package com.example.car_rental_group3.entity;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

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
	
	@ManyToMany(mappedBy = "bookings")
	List<Car> cars;
	
	
}
