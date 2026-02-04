package com.example.demo.service.impl;

import com.example.demo.dto.AuthResponseDto;
import com.example.demo.dto.LoginRequestDto;
import com.example.demo.dto.RegisterRequestDto;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.AuthService;
import com.example.demo.util.JwtUtil;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(UserRepository userRepository, 
                          PasswordEncoder passwordEncoder, 
                          JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public AuthResponseDto register(RegisterRequestDto request) {
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);

        // Generate JWT token
        String token = jwtUtil.generateToken(
            savedUser.getId(), 
            savedUser.getUsername(), 
            savedUser.getEmail()
        );

        return new AuthResponseDto(
            token, 
            savedUser.getId(), 
            savedUser.getUsername(), 
            savedUser.getEmail()
        );
    }

    @Override
    public AuthResponseDto login(LoginRequestDto request) {
        // Find user by email or username
        User user = userRepository.findByEmail(request.getEmailOrUsername())
            .or(() -> userRepository.findByUsername(request.getEmailOrUsername()))
            .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        // Validate password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(
            user.getId(), 
            user.getUsername(), 
            user.getEmail()
        );

        return new AuthResponseDto(
            token, 
            user.getId(), 
            user.getUsername(), 
            user.getEmail()
        );
    }
}
