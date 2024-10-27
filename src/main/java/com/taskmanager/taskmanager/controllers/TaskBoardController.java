package com.taskmanager.taskmanager.controllers;

import com.taskmanager.taskmanager.entities.TaskBoard;
import com.taskmanager.taskmanager.entities.User;
import com.taskmanager.taskmanager.services.TaskBoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/taskboards")
public class TaskBoardController {
    @Autowired
    private TaskBoardService taskBoardService;

    @PostMapping
    public ResponseEntity<TaskBoard> createTaskBoard(@RequestBody TaskBoard taskBoard) {
        TaskBoard createdTaskBoard = taskBoardService.createTaskBoard(taskBoard);
        return new ResponseEntity<>(createdTaskBoard, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskBoard> getTaskBoardById(@PathVariable Long id) {
        Optional<TaskBoard> taskBoard = taskBoardService.getTaskBoardById(id);
        return taskBoard.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/creator/{createdBy}")
    public ResponseEntity<List<TaskBoard>> getTaskBoardsByCreatedBy(@PathVariable User createdBy) {
        List<TaskBoard> taskBoards = taskBoardService.getTaskBoardsByCreatedBy(createdBy);
        return ResponseEntity.ok(taskBoards);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTaskBoard(@PathVariable Long id) {
        taskBoardService.deleteTaskBoard(id);
        return ResponseEntity.noContent().build();
    }
}
