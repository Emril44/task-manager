package com.taskmanager.taskmanager.dtos;

import java.util.List;

public class TaskBoardDto {
    private Long id;
    private String name;
    private String description;
    private Long createdBy;
    private List<Long> taskIds; // Only references to task IDs

    // Getters and setters
}