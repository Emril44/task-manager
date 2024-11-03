package com.taskmanager.taskmanager.controllers;

import com.taskmanager.taskmanager.entities.Task;
import com.taskmanager.taskmanager.entities.TaskBoard;
import com.taskmanager.taskmanager.entities.User;
import com.taskmanager.taskmanager.services.TaskBoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/task_boards")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskBoardController {
    @Autowired
    private TaskBoardService taskBoardService;

    @PostMapping
    public ResponseEntity<TaskBoard> createTaskBoard(@RequestBody TaskBoard taskBoard) {
        TaskBoard createdTaskBoard = taskBoardService.createTaskBoard(taskBoard);
        return new ResponseEntity<>(createdTaskBoard, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllTaskBoards() {
        List<Map<String, Object>> simplifiedTaskBoards = taskBoardService.getAllTaskBoards().stream()
                .map(board -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", board.getId());
                    map.put("name", board.getName());
                    map.put("description", board.getDescription());
                    // Add other essential fields as needed
                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(simplifiedTaskBoards);
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
