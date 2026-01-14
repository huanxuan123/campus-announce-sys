package com.campus.announce.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * 页面路由控制器
 * 负责将URL请求映射到对应的JSP页面
 */
@Controller
public class PageController {

    private static final Logger logger = LoggerFactory.getLogger(PageController.class);

    public PageController() {
        logger.debug("PageController 初始化");
    }

    @GetMapping({"/login", "**/login"})
    public String login() {
        logger.debug("访问登录页面");
        return "/login.jsp";
    }

    @GetMapping({"/register", "**/register"})
    public String register() {
        logger.debug("访问注册页面");
        return "/register.jsp";
    }

    @GetMapping({"/forgot-password", "**/forgot-password"})
    public String forgotPassword() {
        logger.debug("访问忘记密码页面");
        return "/forgot-password.jsp";
    }

    @GetMapping({"/reset-password", "**/reset-password"})
    public String resetPassword() {
        logger.debug("访问重置密码页面");
        return "/reset-password.jsp";
    }

    @GetMapping({"/profile", "**/profile"})
    public String profile() {
        logger.debug("访问个人资料页面");
        return "/profile.jsp";
    }

    @GetMapping({"/user-list", "**/user-list"})
    public String userList() {
        logger.debug("访问用户列表页面");
        return "/user-list.jsp";
    }
}