package com.taskmanager.taskmanager.services;

import com.taskmanager.taskmanager.dtos.TaskBoardDto;
import com.taskmanager.taskmanager.entities.Task;
import com.taskmanager.taskmanager.entities.TaskBoard;
import com.taskmanager.taskmanager.entities.User;
import com.taskmanager.taskmanager.exceptions.TaskBoardNotFoundException;
import com.taskmanager.taskmanager.repositories.TaskBoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    public List<TaskBoard> getAllTaskBoards() {
        return taskBoardRepository.findAll();
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

    @Transactional
    public TaskBoard updateTaskBoard(Long boardId, TaskBoard updatedBoard) {
        // Find the existing task board by ID
        TaskBoard existingBoard = taskBoardRepository.findById(boardId)
                .orElseThrow(() -> new TaskBoardNotFoundException("TaskBoard not found with ID: " + boardId));

        // Update fields as necessary
        existingBoard.setName(updatedBoard.getName());
        existingBoard.setDescription(updatedBoard.getDescription());

        // Save the updated task board back to the database
        return taskBoardRepository.save(existingBoard);
    }

    public List<TaskBoard> getBoardsByArchived(boolean archived) {
        return taskBoardRepository.findByArchived(archived);
    }

    public TaskBoard saveBoard(TaskBoard board) {
        return taskBoardRepository.save(board);
    }

    public TaskBoardDto convertToDto(TaskBoard board) {
        TaskBoardDto dto = new TaskBoardDto();
        dto.setId(board.getId());
        dto.setName(board.getName());
        dto.setDescription(board.getDescription());
        dto.setCreatedBy(board.getCreatedBy() != null ? board.getCreatedBy().getId() : null);
        dto.setTaskIds(
                board.getTasks() != null
                        ? board.getTasks().stream().map(Task::getId).collect(Collectors.toList())
                        : new ArrayList<>()
        );
        return dto;
    }
}

