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
    public ResponseEntity<String> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication;
            try {
                authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
                System.out.println("Authentication successful: " + authentication.isAuthenticated());
            } catch (Exception e) {
                System.out.println("Authentication failed: " + e.getMessage());
                return ResponseEntity.badRequest().body("Invalid email or password");
            }

            System.out.println(loginRequest.getEmail());
            System.out.println(loginRequest.getPassword());

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            System.out.println("UserDetails: " + userDetails.getUsername());
            System.out.println("JWT: " + jwtSecret);
            try {
                String token = Jwts.builder()
                        .setSubject(userDetails.getUsername())
                        .signWith(SignatureAlgorithm.HS256, jwtSecret.getBytes())
                        .compact();
                System.out.println("Generated JWT Token: " + token);
                return ResponseEntity.ok(token);
            } catch (Exception e) {
                System.out.println("Error generating token: " + e.getMessage());
                return ResponseEntity.badRequest().body("Token generation error");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid email or password");
        }
    }
}
