package com.taskmanager.taskmanager.dtos;

import com.taskmanager.taskmanager.entities.User;

public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String role;

    public UserDto() {}
    public UserDto(Long id, String email) {
        this.id = id;
        this.email = email;
    }
    public UserDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.role = user.getRole();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
