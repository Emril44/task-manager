package com.taskmanager.taskmanager.repositories;

import com.taskmanager.taskmanager.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    // Find tasks by status
    List<Task> findByStatus(String status);

    // Find tasks by priority
    List<Task> findByPriority(int priority);

    // Find tasks assigned to a particular user
    List<Task> findByAssignedUserId(Long userId);

    List<Task> findByTaskBoardId(Long taskBoardId);
}
