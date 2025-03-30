package com.taskmanager.taskmanager.controllers;

import com.taskmanager.taskmanager.dtos.TaskBoardDto;
import com.taskmanager.taskmanager.entities.Task;
import com.taskmanager.taskmanager.entities.TaskBoard;
import com.taskmanager.taskmanager.entities.User;
import com.taskmanager.taskmanager.services.TaskBoardService;
import com.taskmanager.taskmanager.services.TaskService;
import com.taskmanager.taskmanager.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
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

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<TaskBoard> createTaskBoard(@RequestBody TaskBoard taskBoard, Principal principal) {
        User currentUser = userService.getUserByEmail(principal.getName());

        if (!currentUser.getRole().equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

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
                    map.put("archived", board.getArchived());
                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(simplifiedTaskBoards);
    }

    @GetMapping("/{id}/tasks")
    public ResponseEntity<List<Map<String, Object>>> getTasksByTaskBoardId(@PathVariable Long id) {
        List<Task> tasks = taskService.getTasksByTaskBoardId(id);
        List<Map<String, Object>> simplifiedTasks = tasks.stream()
                .map(task -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", task.getId());
                    map.put("title", task.getTitle());
                    map.put("description", task.getDescription());
                    map.put("status", task.getStatus());
                    map.put("priority", task.getPriority());
                    map.put("dueDate", task.getDueDate());
                    map.put("assignedUserId", task.getAssignedUser() != null ? task.getAssignedUser().getId() : null); // Handle null case
                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(simplifiedTasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskBoard> getTaskBoardById(@PathVariable Long id) {
        Optional<TaskBoard> taskBoard = taskBoardService.getTaskBoardById(id);
        return taskBoard.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PutMapping("/{boardId}")
    public ResponseEntity<TaskBoard> updateTaskBoard(@PathVariable Long boardId, @RequestBody TaskBoard updatedBoard, Principal principal) {
        User currentUser = userService.getUserByEmail(principal.getName());

        if (currentUser.getRole().equals("ADMIN")) {
            TaskBoard board = taskBoardService.updateTaskBoard(boardId, updatedBoard);
            return ResponseEntity.ok(board);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @GetMapping("/creator/{createdBy}")
    public ResponseEntity<List<TaskBoard>> getTaskBoardsByCreatedBy(@PathVariable User createdBy) {
        List<TaskBoard> taskBoards = taskBoardService.getTaskBoardsByCreatedBy(createdBy);
        return ResponseEntity.ok(taskBoards);
    }

    @GetMapping("/active")
    public ResponseEntity<List<TaskBoardDto>> getActiveBoards() {
        List<TaskBoardDto> dtos = taskBoardService.getBoardsByArchived(false)
                .stream()
                .map(board -> taskBoardService.convertToDto(board))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/archived")
    public ResponseEntity<List<TaskBoardDto>> getArchivedBoards() {
        List<TaskBoardDto> dtos = taskBoardService.getBoardsByArchived(true)
                .stream()
                .map(board -> taskBoardService.convertToDto(board))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{boardId}/archive")
    public ResponseEntity<TaskBoard> archiveBoard(@PathVariable Long boardId, @RequestParam boolean archived, Principal principal) {
        User currentUser = userService.getUserByEmail(principal.getName());

        if (!"ADMIN".equals(currentUser.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        TaskBoard board = taskBoardService.getTaskBoardById(boardId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Board not found"));

        board.setArchived(archived);
        TaskBoard updated = taskBoardService.saveBoard(board);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTaskBoard(@PathVariable Long id) {
        taskBoardService.deleteTaskBoard(id);
        return ResponseEntity.noContent().build();
    }
}
