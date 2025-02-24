package com.example.car_rental_group3.service;


import com.example.car_rental_group3.dto.request.RegisterRequest;
import com.example.car_rental_group3.dto.request.UpdateUserRequest;
import com.example.car_rental_group3.dto.response.ApiResponse;
import com.example.car_rental_group3.entity.User;
import com.example.car_rental_group3.repository.UserRepository;
import io.micrometer.common.util.StringUtils;
import jakarta.servlet.http.HttpSession;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    public List<User> getUser() {
        return userRepository.findAll();
    }

    public ApiResponse loginUser(String email, String password, HttpSession session) {
        Optional<User> user = userRepository.findByEmailAndPassword(email, password);

        if (user.isPresent()) {
            session.setAttribute("user", user.get());
            return new ApiResponse(true, "Đăng nhập thành công", Map.of("role", user.get().getRole()));
        }
        return new ApiResponse(false, "Sai email hoặc mật khẩu", null);
    }

    public ApiResponse logoutUser(HttpSession session) {
        session.invalidate();
        return new ApiResponse(true, "Đăng xuất thành công", null);
    }

    public ApiResponse getUserSession(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return new ApiResponse(false, "Chưa đăng nhập", null);
        }

        return new ApiResponse(true, "Thông tin người dùng", user);
    }

    public ApiResponse registerUser(RegisterRequest registerRequest) {
        // Ko cần check tên, vì có thể nhiều người trùng tên mà
        if ( StringUtils.isBlank(registerRequest.getName()) ||
                StringUtils.isBlank(registerRequest.getPhoneNo()) ||
                StringUtils.isBlank(registerRequest.getPassword()) ||
                StringUtils.isBlank(registerRequest.getConfirmPassword()) ||
                StringUtils.isBlank(registerRequest.getEmail()) ||
                StringUtils.isBlank(registerRequest.getRole()) ) {
            return new ApiResponse(false, "Chưa nhập đủ thông tin", null);
        } else if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            return new ApiResponse(false, "Xác nhận mật khẩu không đúng", null);
        }else if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return new ApiResponse(false, "Email đã tồn tại", null);
        }

        // AE có thể tìm hiểu thêm về ModelMapper
        User user = modelMapper.map(registerRequest, User.class);
        user.setId(null);

        try {
            userRepository.save(user);
            return new ApiResponse(true, "Đăng ký thành công", null);
        } catch (Exception e) {// In lỗi ra console
            return new ApiResponse(false, "Lỗi khi lưu dữ liệu: " + e.getMessage(), null);
        }
    }

    public ApiResponse changePasswordOfUser(String newPassword, HttpSession session){
        User user = (User) session.getAttribute("user");

        if(user == null){
            return new ApiResponse(true, "Lỗi, chưa có user", null);
        }

        user.setPassword(newPassword);
        userRepository.save(user);

        return new ApiResponse(true, "Đổi mật khẩu thành công!", null);
    }

    public ApiResponse uploadLicense(MultipartFile file, HttpSession session) {
        try {
            // Đảm bảo thư mục tồn tại
            Path uploadPath = Paths.get(System.getProperty("user.dir") + "/src/main/resources/static/assets/license/");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            //Lấy tên người dùng để tạo tên file
            User user = (User) session.getAttribute("user");
            String name = user.getName();
            // Tạo tên file mới theo username
            String filename = file.getOriginalFilename();
            String fileExtension = filename.substring(filename.lastIndexOf(".")); // Lấy phần mở rộng
            String newFileName = name + "_" + System.currentTimeMillis() + fileExtension; // Định dạng tên mới

            // Lưu file vào thư mục
            Path filePath = uploadPath.resolve(newFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Trả về đường dẫn file đã lưu
            return new ApiResponse(true, "Upload file thành công", newFileName);

        } catch (IOException e) {
            return new ApiResponse(false, "Upload file thất bại" + e.getMessage(), null);
        }
    }

    public ApiResponse updateUser(UpdateUserRequest updateUserRequest, HttpSession session){
        User userSession = (User) session.getAttribute("user");
        Integer id = 0;
        if (userSession != null) {
            id = userSession.getId();
        }
        return userRepository.findById(id)
                .map(user -> {
                    user.setName(updateUserRequest.getName());
                    user.setPhoneNo(updateUserRequest.getPhoneNo());
                    user.setEmail(updateUserRequest.getEmail());
                    user.setDateOfBirth(updateUserRequest.getDateOfBirth());
                    user.setNationalIdNo(updateUserRequest.getNationalIdNo());
                    user.setAddress(updateUserRequest.getAddress());
                    if (updateUserRequest.getDrivingLicense() != null && !updateUserRequest.getDrivingLicense().isEmpty()) {
                        user.setDrivingLicense(updateUserRequest.getDrivingLicense());
                    }
                    User savedUser = userRepository.save(user);
                    session.setAttribute("user", savedUser);
                    return new ApiResponse(true, "Sửa thông tin người dùng thành công", savedUser);
                })
                .orElseGet(() -> new ApiResponse(false, "Không tìm thấy người dùng", null));
    }
}
