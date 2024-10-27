package com.taskmanager.taskmanager.repositories;

import com.taskmanager.taskmanager.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    // Custom query to find a User by username
    User findByUsername(String username);

    List<User> getAllUsers();
}

