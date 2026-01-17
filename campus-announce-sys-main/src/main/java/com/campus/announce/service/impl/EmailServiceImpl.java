package com.campus.announce.service.impl;

import com.campus.announce.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${mail.from}")
    private String fromEmail;

    @Value("${mail.from.name}")
    private String fromName;

    @Override
    public void sendPasswordResetEmail(String toEmail, String username, String resetToken) throws MessagingException {
        String subject = "校园公告系统 - 密码重置";
        String resetUrl = "http://localhost:8080/campus-announce-sys/reset-password?token=" + resetToken;

        String content = "尊敬的 " + username + "：\n\n" +
                "您收到了一封密码重置邮件。如果您没有请求重置密码，请忽略此邮件。\n\n" +
                "请点击以下链接重置您的密码（链接30分钟内有效）：\n\n" +
                resetUrl + "\n\n" +
                "如果链接无法点击，请将链接复制到浏览器地址栏中访问。\n\n" +
                "此邮件由系统自动发送，请勿回复。\n\n" +
                "校园公告系统";

        sendSimpleEmail(toEmail, subject, content);
    }

    @Override
    public void sendSimpleEmail(String toEmail, String subject, String content) throws MessagingException {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(content);
        javaMailSender.send(message);
    }
}