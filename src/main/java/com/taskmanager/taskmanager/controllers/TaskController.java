package com.taskmanager.taskmanager.controllers;

import com.taskmanager.taskmanager.entities.Task;
import com.taskmanager.taskmanager.entities.User;
import com.taskmanager.taskmanager.exceptions.TaskNotFoundException;
import com.taskmanager.taskmanager.exceptions.UserNotFoundException;
import com.taskmanager.taskmanager.services.TaskBoardService;
import com.taskmanager.taskmanager.services.TaskService;
import com.taskmanager.taskmanager.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserService userService;

    @Autowired
    private TaskBoardService taskBoardService;

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Map<String, Object> request) {
        Long taskBoardId = ((Number) request.get("task_board_id")).longValue();
        Long assignedUserId = ((Number) request.get("assigned_user")).longValue();

        Task task = new Task();
        task.setTitle((String) request.get("title"));
        task.setDescription((String) request.get("description"));
        task.setStatus((String) request.get("status"));
        task.setPriority((Integer) request.get("priority"));
        task.setDueDate(LocalDate.parse((String) request.get("due_date")));

        // Fetch and assign TaskBoard and User entities based on provided IDs
        task.setTaskBoard(taskBoardService.getTaskBoardById(taskBoardId)
                .orElseThrow(() -> new TaskNotFoundException("TaskBoard not found")));
        task.setAssignedUser(userService.getUserById(assignedUserId)
                .orElseThrow(() -> new UserNotFoundException("User not found")));

        Task createdTask = taskService.createTask(task);
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<Task> getTask(@PathVariable Long taskId, Principal principal) {
        Task task = taskService.getTaskById(taskId)
                .orElseThrow(() -> new TaskNotFoundException("Task not found"));

        User currentUser = userService.getUserByEmail(principal.getName());
        if (currentUser.getRole().equals("ADMIN") || task.getAssignedUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.ok(task);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Task>> getTasksByStatus(@PathVariable String status) {
        List<Task> tasks = taskService.getTasksByStatus(status);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<Task>> getTasksByPriority(@PathVariable int priority) {
        List<Task> tasks = taskService.getTasksByPriority(priority);
        return ResponseEntity.ok(tasks);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}