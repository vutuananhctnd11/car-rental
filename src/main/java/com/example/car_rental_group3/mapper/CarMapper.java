package com.example.car_rental_group3.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.example.car_rental_group3.dto.response.CarListResponse;
import com.example.car_rental_group3.entity.Car;

@Mapper(componentModel = "spring")
public interface CarMapper {

	CarListResponse toCarListResponse (Car car);
	@BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
	void updateCar (@MappingTarget Car newCar, Car updateCar);
}
