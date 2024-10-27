package com.taskmanager.taskmanager.dtos;

public class TaskDto {
    private Long id;
    private String title;
    private String description;
    private String status;
    private int priority;
    private Long taskBoardId;   // Only referencing the ID of the board
    private Long assignedUserId; // Only referencing the ID of the assigned user

    // Getters and setters
}
