package com.taskmanager.taskmanager.services;

import com.taskmanager.taskmanager.entities.User;
import com.taskmanager.taskmanager.repositories.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @PostConstruct
    public void initAdmin() {
        Optional<User> existingAdmin = Optional.ofNullable(userRepository.findByEmail("admin@example.com"));

        // Only create the admin user if it doesn't already exist
        if (existingAdmin.isEmpty()) {
            User admin = new User();
            admin.setUsername("admin_user");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123")); // Set a known, hashed password
            admin.setRole("ADMIN");
            userRepository.save(admin);
        }
    }

    public User getUserByEmail(String username) {return userRepository.findByEmail(username);
    }
}
