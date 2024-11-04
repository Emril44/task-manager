package com.taskmanager.taskmanager.services;

import com.taskmanager.taskmanager.entities.User;
import com.taskmanager.taskmanager.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        logger.debug("Attempting to load user by email: {}", email);

        User user = userRepository.findByEmail(email);
        if (user == null) {
            logger.error("User not found for email: {}", email);
            throw new UsernameNotFoundException("User not found");
        }

        logger.debug("User found for email: {}, User ID: {}", email, user.getId());
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),  // Make sure this is the hashed password
                new ArrayList<>()    // Roles/authorities if any
        );
    }
}
