package com.example.car_rental_group3.dto.request;

import com.example.car_rental_group3.dto.response.ApiPageableResponse;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CarSearchRequest {

	String search;
	int limit;
	int page;
}
