package com.example.car_rental_group3.controller;

import com.example.car_rental_group3.dto.request.LoginRequest;
import com.example.car_rental_group3.dto.request.RegisterRequest;
import com.example.car_rental_group3.dto.request.UpdateUserRequest;
import com.example.car_rental_group3.dto.response.ApiResponse;
import com.example.car_rental_group3.entity.User;
import com.example.car_rental_group3.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@CrossOrigin(origins = "http://127.0.0.1:5500")
@RestController
@RequestMapping
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/user")
    public List<User> getUser(){
        return userService.getUser();
    }

    @PostMapping("/login")
    public ApiResponse login(@RequestBody LoginRequest loginRequest, HttpSession session) {
        return userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword(), session);
    }

    @GetMapping("/logout")
    public ApiResponse logout(HttpSession session) {
        return userService.logoutUser(session);
    }

    @GetMapping("/me")
    public ApiResponse getUserSession(HttpSession session) {
        return userService.getUserSession(session);
    }

    @PostMapping("/register")
    public ApiResponse register(@RequestBody RegisterRequest registerRequest) { return userService.registerUser(registerRequest); }

    @PostMapping("/uplicense")
    public ApiResponse upload(@RequestParam("file") MultipartFile file, HttpSession session){
        return userService.uploadLicense(file, session);
    }

    @PostMapping("/changepassword")
    public ApiResponse changePassword(@RequestBody RegisterRequest registerRequest, HttpSession session){
        return userService.changePasswordOfUser(registerRequest.getPassword(), session);
    }

    @PutMapping("/updateuser")
    public ApiResponse updateUser(@RequestBody UpdateUserRequest updateUserRequest, HttpSession session){
        return userService.updateUser(updateUserRequest, session);
    }
}
