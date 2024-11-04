package com.taskmanager.taskmanager.controllers;

// Import statements
import com.taskmanager.taskmanager.dtos.LoginRequest;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.taskmanager.taskmanager.entities.User;
import com.taskmanager.taskmanager.services.UserService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        // Check if username or email already exists (optional)
        if (userService.getUserByUsername(user.getUsername()) != null) {
            return ResponseEntity.badRequest().body("Username already taken");
        }

        // Hash the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Save the new user
        userService.createUser(user);

        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            // Authenticate the user with the provided email and password
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            // Retrieve the User entity to access the user ID
            User user = userService.getUserByEmail(userDetails.getUsername());

            // Generate the JWT token
            String token = Jwts.builder()
                    .setSubject(userDetails.getUsername())
                    .signWith(SignatureAlgorithm.HS256, jwtSecret.getBytes())
                    .compact();

            // Create the response map containing both token and userId
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("userId", user.getId()); // Add userId to the response

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println("Authentication or token generation failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(null); // Return null or an error message if needed
        }
    }
}
