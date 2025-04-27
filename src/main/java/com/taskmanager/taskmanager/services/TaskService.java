package com.taskmanager.taskmanager.services;

import com.taskmanager.taskmanager.entities.Task;
import com.taskmanager.taskmanager.repositories.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;

    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public List<Task> getTasksByStatus(String status) {
        return taskRepository.findByStatus(status);
    }

    public List<Task> getTasksByPriority(int priority) {
        return taskRepository.findByPriority(priority);
    }

    public List<Task> getTasksByAssignedUserId(Long userId) {
        return taskRepository.findByAssignedUserId(userId);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    public List<Task> getTasksByTaskBoardId(Long id) {return taskRepository.findByTaskBoardId(id);}

    public Task saveTask(Task existingTask) {return taskRepository.save(existingTask);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }
}
