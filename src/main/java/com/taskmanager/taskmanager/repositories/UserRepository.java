package com.taskmanager.taskmanager.repositories;

import com.taskmanager.taskmanager.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    // Custom query to find a User by username
    User findByUsername(String username);

    User findByEmail(String email);
}

