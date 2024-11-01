package com.taskmanager.taskmanager.controllers;

// Import statements
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
    private AuthenticationManager authenticationManager;
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
    public ResponseEntity<String> loginUser(@RequestBody User loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(), loginRequest.getPassword())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = Jwts.builder()
                    .setSubject(userDetails.getUsername())
                    .signWith(SignatureAlgorithm.HS512, jwtSecret)
                    .compact();

            return ResponseEntity.ok(token);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid username or password");
        }
    }
}
