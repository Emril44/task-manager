package com.taskmanager.taskmanager.controllers;

import com.taskmanager.taskmanager.dtos.TaskDto;
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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
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
    public ResponseEntity<TaskDto> createTask(@RequestBody Map<String, Object> request) {
        Task task = new Task();
        task.setTitle((String) request.get("title"));
        task.setDescription((String) request.get("description"));
        task.setStatus((String) request.get("status"));
        task.setPriority((Integer) request.get("priority"));

        // Parse the date if it's provided as a string
        if (request.get("due_date") != null) {
            task.setDueDate(LocalDate.parse((String) request.get("due_date")));
        }

        // Fetch and set the task board and assigned user by their IDs
        Long taskBoardId = ((Number) request.get("task_board_id")).longValue();
        Long assignedUserId = ((Number) request.get("assigned_user")).longValue();
        task.setTaskBoard(taskBoardService.getTaskBoardById(taskBoardId).orElseThrow(() -> new TaskNotFoundException("Task board not found")));
        task.setAssignedUser(userService.getUserById(assignedUserId).orElseThrow(() -> new UserNotFoundException("User not found")));

        Task createdTask = taskService.createTask(task);
        TaskDto taskDto = new TaskDto(createdTask);  // Map Task to TaskDTO

        return ResponseEntity.status(HttpStatus.CREATED).body(taskDto);
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

    @PutMapping("/{taskId}")
    public ResponseEntity<?> updateTask(
            @PathVariable Long taskId,
            @RequestBody TaskDto updatedTaskDto) {

        // Get the current authenticated user from SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication not found");
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        User user = userService.getUserByEmail(username);

        // Retrieve the task to be updated
        Task task = taskService.getTaskById(taskId)
                .orElseThrow(() -> new TaskNotFoundException("Task not found"));

        // Optional: Check permissions - for example, only admins or assigned users can update the task
        if (!task.getAssignedUser().getEmail().equals(username) && !user.getRole().equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not authorized to update this task");
        }

        // Update task details with the values from the request body
        task.setTitle(updatedTaskDto.getTitle());
        task.setDescription(updatedTaskDto.getDescription());
        task.setStatus(updatedTaskDto.getStatus());
        task.setPriority(updatedTaskDto.getPriority());
        task.setDueDate(updatedTaskDto.getDueDate());

        // Save the updated task
        Task updatedTask = taskService.saveTask(task);

        // Return the updated task in the response
        return ResponseEntity.ok(new TaskDto(updatedTask));
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