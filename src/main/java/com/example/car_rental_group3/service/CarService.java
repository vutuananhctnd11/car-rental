package com.example.car_rental_group3.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.car_rental_group3.dto.response.CarListResponse;
import com.example.car_rental_group3.entity.Car;
import com.example.car_rental_group3.entity.User;
import com.example.car_rental_group3.mapper.CarMapper;
import com.example.car_rental_group3.repository.CarRepository;
import com.example.car_rental_group3.repository.UserRepository;

import io.micrometer.common.util.StringUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CarService {
	
	CarRepository carRepository;
	
	CarMapper carMapper;
	
	UserRepository userRepository;

	public List<CarListResponse> getAllCar (){
		
		List<Car> cars = carRepository.findAll();
		List<CarListResponse> result = new ArrayList<>();
		for (Car car : cars) {
			User user = userRepository.findById(car.getUser().getId()).orElse(null);
			if (user == null) return result;
			CarListResponse carResponse = carMapper.toCarListResponse(car);
			result.add(carResponse);
		}
		return result;
	}
	
	public List<CarListResponse> getAllCar (Pageable pageable){
		List<Car> cars = carRepository.findAll(pageable).getContent();
		List<CarListResponse> result = new ArrayList<>();
		for (Car car : cars) {
			User user = userRepository.findById(car.getUser().getId()).orElse(null);
			if (user == null) return result;
			CarListResponse carResponse = carMapper.toCarListResponse(car);
			result.add(carResponse);
		}
		return result;
	}
	
	public Car getCarDescription (int id) {
		Car car = carRepository.findById(id).orElse(null);
		return car;	
	}
	
	public int getTotalCar () {
		return (int) carRepository.count();
	}
	
	public Car createCar (Car car, int carOwnerId) {
		User user = userRepository.findById(carOwnerId).orElse(null);
		if (StringUtils.isBlank(car.getName()) || StringUtils.isBlank(car.getLicensePlate()) ||
				StringUtils.isBlank(car.getColor()) || StringUtils.isBlank(car.getBrand()) ||
				StringUtils.isBlank(car.getModel()) || car.getProductionYears() <0||
				car.getNumberOfSeats() == 0 || StringUtils.isBlank(car.getTransmissionType()) ||
				StringUtils.isBlank(car.getFuelType()) || car.getMileage() <=0 ||
				StringUtils.isBlank(car.getFuelConsumption()) || StringUtils.isBlank(car.getAddress()) ||
				StringUtils.isBlank(car.getDescription()) || StringUtils.isBlank(car.getAdditionalFunctions()) ||
				car.getBaseprice() <=0 || car.getDeposit() <=0 || StringUtils.isBlank(car.getTermOfUse())
				) return null;
		else {
			car.setUser(user);
			car = carRepository.save(car);
			return car;
		}			
	}
	
	public Car updateCar (Car car) {
		return null;
	}
	
	public List<CarListResponse> getAllByCarOwnerId (int carOwnerId, Pageable pageable){
		List<Car> cars = carRepository.findAllByUserId(carOwnerId, pageable).getContent();
		List<CarListResponse> result = new ArrayList<CarListResponse>();
		for (Car car : cars) {
			CarListResponse carResponse = carMapper.toCarListResponse(car);
			result.add(carResponse);
		}
		return result;
	}
	
	public List<CarListResponse> searchByAddress (String address, Pageable pageable){
		List<Car> cars = carRepository.findAllByAddressContainingIgnoreCase(address, pageable).getContent();
		List<CarListResponse> result = new ArrayList<CarListResponse>();
		for (Car car : cars) {
			CarListResponse carResponse = carMapper.toCarListResponse(car);
			result.add(carResponse);
		}
		return result;
	}
}

