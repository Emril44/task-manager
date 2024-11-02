package com.taskmanager.taskmanager.services;

import com.taskmanager.taskmanager.entities.User;
import com.taskmanager.taskmanager.repositories.UserRepository;
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

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        System.out.println("Loaded user: " + user.getUsername());
        System.out.println("Stored password hash: " + user.getPassword());  // Log the stored hash
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),  // Ensure this is the hashed password
                new ArrayList<>()    // Roles/authorities if any
        );
    }
}
