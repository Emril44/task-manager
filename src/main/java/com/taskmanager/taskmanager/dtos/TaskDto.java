package com.taskmanager.taskmanager.dtos;

import com.taskmanager.taskmanager.entities.Task;

import java.time.LocalDate;

public class TaskDto {
    private Long id;
    private String title;
    private String description;
    private String status;
    private int priority;
    private LocalDate dueDate;
    private Long taskBoardId;   // Only referencing the ID of the board
    private Long assignedUserId; // Only referencing the ID of the assigned user

    public TaskDto(Task task) {
        this.id = task.getId();
        this.title = task.getTitle();
        this.description = task.getDescription();
        this.status = task.getStatus();
        this.priority = task.getPriority();
        this.taskBoardId = task.getTaskBoard().getId();
        this.assignedUserId = task.getAssignedUser().getId();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getPriority() {
        return priority;
    }

    public void setPriority(int priority) {
        this.priority = priority;
    }

    public Long getTaskBoardId() {
        return taskBoardId;
    }

    public void setTaskBoardId(Long taskBoardId) {
        this.taskBoardId = taskBoardId;
    }

    public Long getAssignedUserId() {
        return assignedUserId;
    }

    public void setAssignedUserId(Long assignedUserId) {
        this.assignedUserId = assignedUserId;
    }
}
