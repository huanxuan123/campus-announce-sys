package com.campus.announce.controller;

import com.campus.announce.common.Result;
import com.campus.announce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/password")
public class PasswordController {

    @Autowired
    private UserService userService;

    @PostMapping("/forgot")
    public Result<String> forgotPassword(@RequestParam String email) {
        try {
            String sentEmail = userService.sendPasswordResetEmail(email);
            return Result.success("重置邮件已发送到：" + sentEmail);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/reset")
    public Result<String> resetPassword(
            @RequestParam String token,
            @RequestParam String newPassword) {
        try {
            boolean success = userService.resetPassword(token, newPassword);
            if (success) {
                return Result.success("密码重置成功");
            } else {
                return Result.error("密码重置失败");
            }
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}