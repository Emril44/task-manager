package com.taskmanager.taskmanager.repositories;

import com.taskmanager.taskmanager.entities.TaskBoard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskBoardRepository extends JpaRepository<TaskBoard, Long> {
    // Find all task boards created by a specific user
    List<TaskBoard> findByCreatedBy(Long userId);

    // Find a task board by its name
    TaskBoard findByName(String name);
}
