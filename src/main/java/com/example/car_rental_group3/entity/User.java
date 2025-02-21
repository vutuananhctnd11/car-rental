package com.example.car_rental_group3.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity(name = "user")
public class User extends Base{
    private String name;
    private String phoneNo;
    private String password;
    private String email;
    private String role;
    private String dateOfBirth;
    private String nationalIdNo;
    private String address;
    private String drivingLicense;
    private float wallet;
    
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore		// bỏ qua list car khi lấy user
    private List<Car> cars;
}
