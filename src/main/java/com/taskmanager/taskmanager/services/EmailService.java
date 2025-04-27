package com.taskmanager.taskmanager.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendTaskAssignmentEmail(String toEmail, String taskTitle, String taskDescription, String dueDate) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("New Task Assigned: " + taskTitle);
        message.setText(
                "You have been assigned a new task!\n\n" +
                        "Title: " + taskTitle + "\n" +
                        "Description: " + taskDescription + "\n" +
                        "Due Date: " + dueDate + "\n\n" +
                        "Good luck!"
        );
        message.setFrom("your-email@gmail.com");
        mailSender.send(message);
    }
}
