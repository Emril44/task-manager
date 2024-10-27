package com.taskmanager.taskmanager.services;

import com.taskmanager.taskmanager.entities.TaskBoard;
import com.taskmanager.taskmanager.entities.User;
import com.taskmanager.taskmanager.repositories.TaskBoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskBoardService {
    @Autowired
    private TaskBoardRepository taskBoardRepository;

    public TaskBoard createTaskBoard(TaskBoard taskBoard) {
        return taskBoardRepository.save(taskBoard);
    }

    public Optional<TaskBoard> getTaskBoardById(Long id) {
        return taskBoardRepository.findById(id);
    }

    public List<TaskBoard> getTaskBoardsByCreatedBy(User createdBy) {
        return taskBoardRepository.findByCreatedBy(createdBy);
    }

    public TaskBoard getTaskBoardByName(String name) {
        return taskBoardRepository.findByName(name);
    }

    public void deleteTaskBoard(Long id) {
        taskBoardRepository.deleteById(id);
    }
}

