package com.example.car_rental_group3.controller;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.car_rental_group3.dto.request.CarSearchRequest;
import com.example.car_rental_group3.dto.response.ApiPageableResponse;
import com.example.car_rental_group3.dto.response.ApiResponse;
import com.example.car_rental_group3.dto.response.CarListResponse;
import com.example.car_rental_group3.entity.Car;
import com.example.car_rental_group3.service.CarService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/car")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CarController {
	
	CarService carService;

	@GetMapping("/all")
	public ApiResponse getAllCar () {
		List<CarListResponse> cars = carService.getAllCar();
		ApiResponse apiResponse = new ApiResponse();
		if (cars.isEmpty()) {
			apiResponse.setSuccess(false);
			apiResponse.setMessage("Không có xe nào!");
		} else {
			apiResponse.setData(cars);
			apiResponse.setSuccess(true);
		}
		
		return apiResponse;
	}
	
	@GetMapping
	public ApiPageableResponse getAllCarByCarOwnerId (@RequestParam int userid, @RequestParam int page, @RequestParam int limit) {
		Pageable pageable = PageRequest.of(page-1, limit);
		int totalPage = (int) Math.ceil(carService.getTotalCar()/limit);
		List<CarListResponse> cars = carService.getAllByCarOwnerId(userid, pageable);
		if (cars.isEmpty()) {
			return ApiPageableResponse.builder()
					.success(false)
					.message("You don't have any car for rental!")
					.build();
		}
		return ApiPageableResponse.builder()
				.success(true)
				.limit(limit)
				.page(page)
				.totalPage(totalPage==0 ? 1 : totalPage)
				.data(cars)
				.build();
	}
	
	@GetMapping("/{carId}")
	public ApiResponse getCarDescription (@PathVariable int carId) {
		return ApiResponse.builder()
				.success(true)
				.data(carService.getCarDescription(carId))
				.build();
	}
	
	@PostMapping("/search")
	public ApiPageableResponse searchCar (@RequestBody CarSearchRequest carSearch) {
		Pageable pageable = PageRequest.of(carSearch.getPage()-1, carSearch.getLimit());
		int totalPage = (int) Math.ceil(carService.getTotalCar()/carSearch.getLimit());
		List<CarListResponse> cars = carService.searchByAddress(carSearch.getSearch(), pageable);
		if (cars.isEmpty()) {
			return ApiPageableResponse.builder()
					.success(false)
					.message("No matching results were found!")
					.build();
		}
		return ApiPageableResponse.builder()
				.success(true)
				.limit(carSearch.getLimit())
				.page(carSearch.getPage())
				.totalPage(totalPage==0 ? 1 : totalPage)
				.data(cars)
				.build();
	}
	
	@PostMapping("/{carOwnerId}")
	public ApiResponse createCar (@RequestBody Car car, @PathVariable int carOwnerId) {
		Car result = carService.createCar(car, carOwnerId);
		if (result==null) return ApiResponse.builder()
											.success(false)
											.message("You have not entered enough data")
											.build();
		return ApiResponse.builder()
				.success(true)
				.data(result)
				.build();
	}
}
