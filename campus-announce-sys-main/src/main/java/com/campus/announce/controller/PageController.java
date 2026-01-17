package com.campus.announce.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;

/**
 * 页面路由控制器
 * 负责将URL请求映射到对应的JSP页面
 */
@Controller
public class PageController {

    private static final Logger logger = LoggerFactory.getLogger(PageController.class);
    
    @Autowired
    private ServletContext servletContext;

    public PageController() {
        logger.debug("PageController 初始化");
    }

    @GetMapping({"/login", "**/login"})
    public String login() {
        logger.debug("访问登录页面");
        return "login";
    }

    @GetMapping({"/register", "**/register"})
    public String register() {
        logger.debug("访问注册页面");
        return "register";
    }

    @GetMapping({"/forgot-password", "**/forgot-password"})
    public String forgotPassword() {
        logger.debug("访问忘记密码页面");
        return "forgot-password";
    }

    @GetMapping({"/reset-password", "**/reset-password"})
    public String resetPassword() {
        logger.debug("访问重置密码页面");
        return "reset-password";
    }

    @GetMapping({"/profile", "**/profile"})
    public String profile() {
        logger.debug("访问个人资料页面");
        return "profile";
    }

    @GetMapping({"/user-list", "**/user-list"})
    public String userList() {
        logger.debug("访问用户列表页面");
        return "user-list";
    }
    
    @GetMapping({"/announcement", "**/announcement"})
    public String announcement() {
        logger.debug("访问公告详情页面");
        return "announcement-detail";
    }
    
    @GetMapping("/favicon.ico")
    public void favicon(HttpServletResponse response) throws IOException {
        logger.debug("访问favicon.ico");
        response.setContentType("image/x-icon");
        response.setHeader("Cache-Control", "public, max-age=86400");
        
        try (InputStream is = servletContext.getResourceAsStream("/favicon.ico")) {
            if (is == null) {
                response.sendError(HttpServletResponse.SC_NOT_FOUND);
                return;
            }
            org.apache.commons.io.IOUtils.copy(is, response.getOutputStream());
        }
    }
}