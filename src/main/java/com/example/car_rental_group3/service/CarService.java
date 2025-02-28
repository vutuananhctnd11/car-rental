package com.example.car_rental_group3.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.car_rental_group3.dto.response.ApiResponse;
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
import lombok.extern.java.Log;
import lombok.extern.slf4j.Slf4j;

@Slf4j
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
	
	public ApiResponse getCarDescription (int id) {
		Car car = carRepository.findById(id).orElse(null);
		if (car==null) return ApiResponse.builder().success(false).message("Car not found!").build();
		return ApiResponse.builder().success(true).data(car).build();	
	}
	
	public int getTotalCar () {
		return (int) carRepository.count();
	}
	
	public ApiResponse createCar (Car car, int carOwnerId) {
		User user = userRepository.findById(carOwnerId).orElse(null);
		if (user==null) return ApiResponse.builder().success(false).message("User not found!").build();
		String[] images = car.getImages().split(", ");
		for (String image :images) {
			if (image.trim()=="") return ApiResponse.builder().success(false).message("You must have 4 photos of the car!").build();;
		}
		if (StringUtils.isBlank(car.getName()) || StringUtils.isBlank(car.getLicensePlate()) ||
				StringUtils.isBlank(car.getColor()) || StringUtils.isBlank(car.getBrand()) ||
				StringUtils.isBlank(car.getModel()) || car.getProductionYears() <0||
				car.getNumberOfSeats() == 0 || StringUtils.isBlank(car.getTransmissionType()) ||
				StringUtils.isBlank(car.getFuelType()) || car.getMileage() <=0 ||
				StringUtils.isBlank(car.getFuelConsumption()) || StringUtils.isBlank(car.getAddress()) ||
				StringUtils.isBlank(car.getAdditionalFunctions()) ||
				car.getBaseprice() <=0 || car.getDeposit() <=0 || StringUtils.isBlank(car.getTermOfUse())
				) 
			return ApiResponse.builder().success(false).message("You have not entered enough data").build();
		else {
			car.setUser(user);
			car.setStatus("Available");
			car = carRepository.save(car);
			return ApiResponse.builder().success(true).data(car).build();
		}			
	}
	
	@Transactional
	public ApiResponse updateCar (Car updateCar) {
		Car car = carRepository.findById(updateCar.getId()).orElse(null);
		if (car==null) return ApiResponse.builder().success(false).message("Car not found!").build();
		
		if (StringUtils.isBlank(updateCar.getName()) || StringUtils.isBlank(updateCar.getLicensePlate()) ||
				StringUtils.isBlank(updateCar.getColor()) || StringUtils.isBlank(updateCar.getBrand()) ||
				StringUtils.isBlank(updateCar.getModel()) || updateCar.getProductionYears() <=1000||
				updateCar.getNumberOfSeats() == 0 || StringUtils.isBlank(updateCar.getTransmissionType()) ||
				StringUtils.isBlank(updateCar.getFuelType()) || updateCar.getMileage() <=0 ||
				StringUtils.isBlank(updateCar.getFuelConsumption()) || StringUtils.isBlank(updateCar.getAddress()) ||
				StringUtils.isBlank(updateCar.getAdditionalFunctions()) ||
				updateCar.getBaseprice() <=0 || updateCar.getDeposit() <=0 || StringUtils.isBlank(updateCar.getTermOfUse())
				) 
			return ApiResponse.builder().success(false).message("You have not entered enough data").build();
		
		carMapper.updateCar(car, updateCar);
		car = carRepository.save(car);
		return ApiResponse.builder().success(true).data(car).build();
	}
	
	public ApiResponse stopRentalCar (int carId) {
		Car car = carRepository.findById(carId).orElse(null);
		if ( car == null) return ApiResponse.builder().success(false).message("Car not found!").build();
		log.info("status: "+car.getStatus());
		if  (car.getStatus().compareTo("Booked")==0) return ApiResponse.builder().success(false).message("Your car has been booked. Please "
				+ "contact our administrator if your car is no longer available for rent.").build();
		else if (car.getStatus().compareTo("Stopped")==0) {
			car.setStatus("Available");
			carRepository.save(car);
			return ApiResponse.builder().success(true).message("Update status success!").build();
		} else {
			car.setStatus("Stopped");
			
			carRepository.save(car);
			return ApiResponse.builder().success(true).message("Update status success!").build();
		}
		
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
		List<Car> cars = carRepository.findAllByAddressContainingIgnoreCaseAndStatus(address, "Available", pageable).getContent();
		List<CarListResponse> result = new ArrayList<CarListResponse>();
		for (Car car : cars) {
			CarListResponse carResponse = carMapper.toCarListResponse(car);
			result.add(carResponse);
		}
		return result;
	}
	
	public ApiResponse comfirmDeposit (@RequestParam int carId) {
		return null;
	}
}

