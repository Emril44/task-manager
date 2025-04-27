package com.taskmanager.taskmanager.scheduling;

import com.taskmanager.taskmanager.entities.Task;
import com.taskmanager.taskmanager.services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TaskSchedulerService {

    @Autowired
    private TaskService taskService;

    @Scheduled(fixedRate = 30000) // Every 30 seconds for testing. (Set to 86400000 for daily prod)
    public void updateOverdueTasks() {
        List<Task> allTasks = taskService.getAllTasks();

        for (Task task : allTasks) {
            if (task.getDueDate() != null
                    && task.getDueDate().isBefore(LocalDate.now())
                    && !task.getStatus().equalsIgnoreCase("completed")
                    && !task.getStatus().equalsIgnoreCase("overdue")) {

                task.setStatus("overdue");
                taskService.saveTask(task);
                System.out.println("Updated task to overdue: " + task.getTitle());
            }
        }
    }
}
