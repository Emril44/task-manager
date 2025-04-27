package com.taskmanager.taskmanager.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskmanager.taskmanager.dtos.TaskBoardDto;
import com.taskmanager.taskmanager.dtos.TaskBoardStatsDto;
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
        dto.setArchived(board.isArchived());
        return dto;
    }

    @Transactional
    public TaskBoardStatsDto getStatsForBoard(Long boardId) {
        TaskBoard board = taskBoardRepository.findByIdWithTasks(boardId)
                .orElseThrow(() -> new TaskBoardNotFoundException("Board not found"));

        List<Task> tasks = board.getTasks();
        TaskBoardStatsDto stats = new TaskBoardStatsDto();

        int totalTasks = tasks.size();
        int notStarted = 0, inProgress = 0, completed = 0, overdue=0;
        int lowPriority = 0, mediumPriority = 0, highPriority = 0;

        for (Task task : tasks) {
            switch (task.getStatus().toLowerCase()) {
                case "not started" -> notStarted++;
                case "in progress" -> inProgress++;
                case "completed" -> completed++;
                case "overdue" -> overdue++;
            }

            switch (task.getPriority()) {
                case 1 -> lowPriority++;
                case 2 -> mediumPriority++;
                case 3 -> highPriority++;
            }
        }

        stats.setTotalTasks(totalTasks);
        stats.setNotStarted(notStarted);
        stats.setInProgress(inProgress);
        stats.setCompleted(completed);
        stats.setOverdue(overdue);
        stats.setLowPriority(lowPriority);
        stats.setMediumPriority(mediumPriority);
        stats.setHighPriority(highPriority);

        System.out.println("=== Board Stats Computed ===");
        System.out.println("Total Tasks: " + totalTasks);
        System.out.println("Not Started: " + notStarted);
        System.out.println("In Progress: " + inProgress);
        System.out.println("Completed: " + completed);
        System.out.println("Overdue: " + overdue);
        System.out.println("Low Priority: " + lowPriority);
        System.out.println("Medium Priority: " + mediumPriority);
        System.out.println("High Priority: " + highPriority);
        try {
            System.out.println(new ObjectMapper().writeValueAsString(stats));
        } catch (Exception e) {
            System.out.println("thing broke :c");
        }

        return stats;
    }

    @Transactional
    public TaskBoardStatsDto getGlobalStats() {
        List<TaskBoard> allBoards = taskBoardRepository.findAll();

        TaskBoardStatsDto stats = new TaskBoardStatsDto();
        int total = 0, notStarted = 0, inProgress = 0, completed = 0, overdue=0;
        int low = 0, medium = 0, high = 0;

        for (TaskBoard board : allBoards) {
            for (Task task : board.getTasks()) {
                total++;
                switch (task.getStatus().toLowerCase()) {
                    case "not started" -> notStarted++;
                    case "in progress" -> inProgress++;
                    case "completed" -> completed++;
                    case "overdue" -> overdue++;
                }
                switch (task.getPriority()) {
                    case 1 -> low++;
                    case 2 -> medium++;
                    case 3 -> high++;
                }
            }
        }

        stats.setTotalTasks(total);
        stats.setNotStarted(notStarted);
        stats.setInProgress(inProgress);
        stats.setCompleted(completed);
        stats.setOverdue(overdue);
        stats.setLowPriority(low);
        stats.setMediumPriority(medium);
        stats.setHighPriority(high);

        return stats;
    }
}

