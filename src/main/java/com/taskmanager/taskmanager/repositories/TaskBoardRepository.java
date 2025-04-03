package com.taskmanager.taskmanager.repositories;

import com.taskmanager.taskmanager.entities.TaskBoard;
import com.taskmanager.taskmanager.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TaskBoardRepository extends JpaRepository<TaskBoard, Long> {
    // Find all task boards created by a specific user
    List<TaskBoard> findByCreatedBy(User createdBy);

    // Find a task board by its name
    TaskBoard findByName(String name);

    List<TaskBoard> findByArchived(boolean archived);

    @Query("SELECT b FROM TaskBoard b LEFT JOIN FETCH b.tasks WHERE b.id = :id")
    Optional<TaskBoard> findByIdWithTasks(@Param("id") Long id);
}
