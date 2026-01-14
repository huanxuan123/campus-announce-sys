package com.campus.announce.service;

import javax.mail.MessagingException;

public interface EmailService {

    void sendPasswordResetEmail(String toEmail, String username, String resetToken) throws MessagingException;

    void sendSimpleEmail(String toEmail, String subject, String content) throws MessagingException;
}