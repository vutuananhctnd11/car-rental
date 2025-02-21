package com.example.car_rental_group3.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.car_rental_group3.dto.response.CarListResponse;
import com.example.car_rental_group3.entity.Car;

@Mapper(componentModel = "spring")
public interface CarMapper {

	CarListResponse toCarListResponse (Car car);
}
