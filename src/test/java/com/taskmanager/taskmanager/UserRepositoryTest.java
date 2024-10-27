package com.taskmanager.taskmanager;

import com.taskmanager.taskmanager.entities.User;
import com.taskmanager.taskmanager.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@DataJpaTest
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testSaveUser() {
        User user = new User();
        user.setUsername("newuser");
        user.setEmail("beb@mail.com");
        user.setPassword("password123");
        user.setRole("USER");

        User savedUser = userRepository.save(user);
        assertNotNull(savedUser.getId());
    }
}