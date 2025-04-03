package com.taskmanager.taskmanager.dtos;

import java.util.Map;

public class TaskBoardStatsDto {
    private int totalTasks;
    private int notStarted;
    private int inProgress;
    private int completed;
    private int lowPriority;
    private int mediumPriority;
    private int highPriority;

    public int getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(int totalTasks) {
        this.totalTasks = totalTasks;
    }

    public int getNotStarted() {
        return notStarted;
    }

    public void setNotStarted(int notStarted) {
        this.notStarted = notStarted;
    }

    public int getInProgress() {
        return inProgress;
    }

    public void setInProgress(int inProgress) {
        this.inProgress = inProgress;
    }

    public int getCompleted() {
        return completed;
    }

    public void setCompleted(int completed) {
        this.completed = completed;
    }

    public int getLowPriority() {
        return lowPriority;
    }

    public void setLowPriority(int lowPriority) {
        this.lowPriority = lowPriority;
    }

    public int getMediumPriority() {
        return mediumPriority;
    }

    public void setMediumPriority(int mediumPriority) {
        this.mediumPriority = mediumPriority;
    }

    public int getHighPriority() {
        return highPriority;
    }

    public void setHighPriority(int highPriority) {
        this.highPriority = highPriority;
    }
}
