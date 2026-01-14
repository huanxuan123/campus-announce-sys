package com.campus.announce.controller;

import com.campus.announce.common.Result;
import com.campus.announce.entity.User;
import com.campus.announce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
public class LoginController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public Result<User> login(@RequestBody User loginUser, HttpSession session) {
        try {
            User user = userService.login(loginUser.getUsername(), loginUser.getPassword());
            if (user == null) {
                return Result.error("用户名或密码错误");
            }
            if (user.getStatus() == 0) {
                return Result.error("账号已被禁用");
            }
            session.setAttribute("user", user);
            return Result.success("登录成功", user);
        } catch (Exception e) {
            return Result.error("登录失败：" + e.getMessage());
        }
    }

    @PostMapping("/register")
    public Result<User> register(@RequestBody User user) {
        try {
            User registeredUser = userService.register(user);
            return Result.success("注册成功", registeredUser);
        } catch (Exception e) {
            return Result.error("注册失败：" + e.getMessage());
        }
    }

    @PostMapping("/logout")
    @GetMapping("/logout")
    public Result<String> logout(HttpSession session) {
        session.removeAttribute("user");
        session.invalidate();
        return Result.success("退出成功", null);
    }

    @GetMapping("/currentUser")
    public Result<User> getCurrentUser(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return Result.error("未登录");
        }
        return Result.success(user);
    }
}
