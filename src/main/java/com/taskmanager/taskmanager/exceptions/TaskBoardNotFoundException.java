package com.taskmanager.taskmanager.exceptions;

public class TaskBoardNotFoundException extends RuntimeException {
    public TaskBoardNotFoundException(String message) {
        super(message);
    }
}
