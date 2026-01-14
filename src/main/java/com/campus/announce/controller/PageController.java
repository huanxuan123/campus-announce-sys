package com.campus.announce.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    public PageController() {
        System.out.println("PageController - Constructor called");
    }

    @GetMapping({"/login", "**/login"})
    public String login() {
        System.out.println("PageController - login() called");
        return "login";
    }

    @GetMapping({"/register", "**/register"})
    public String register() {
        System.out.println("PageController - register() called");
        return "register";
    }

    @GetMapping({"/forgot-password", "**/forgot-password"})
    public String forgotPassword() {
        System.out.println("PageController - forgotPassword() called");
        return "forgot-password";
    }

    @GetMapping({"/reset-password", "**/reset-password"})
    public String resetPassword() {
        System.out.println("PageController - resetPassword() called");
        return "reset-password";
    }

    @GetMapping({"/profile", "**/profile"})
    public String profile() {
        System.out.println("PageController - profile() called");
        return "profile";
    }

    @GetMapping({"/user-list", "**/user-list"})
    public String userList() {
        System.out.println("PageController - userList() called");
        return "user-list";
    }
}