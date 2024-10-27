package com.taskmanager.taskmanager;

import com.taskmanager.taskmanager.entities.User;
import com.taskmanager.taskmanager.repositories.UserRepository;
import com.taskmanager.taskmanager.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserService userService;

    @MockBean
    private UserRepository userRepository;

    @BeforeEach
    public void setUp() {
        User user = new User();
        user.setId(1L);
        user.setUsername("testUser");
        user.setEmail("rgegrerg");
        user.setPassword("password123");
        user.setRole("USER");

        // Mock the repository to return the user when queried by ID
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        // Ensure userService has access to userRepository
        userService.createUser(user);
    }

    @Test
    public void testGetUserById() throws Exception {
        mockMvc.perform(get("/api/users/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testUser"));
    }
}