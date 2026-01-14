package com.campus.announce.controller;

import com.campus.announce.common.Result;
import com.campus.announce.entity.User;
import com.campus.announce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/list")
    public Result<List<User>> getUserList() {
        try {
            List<User> list = userService.getAllUsers();
            return Result.success(list);
        } catch (Exception e) {
            return Result.error("查询失败：" + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public Result<User> getUserById(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            if (user == null) {
                return Result.error("用户不存在");
            }
            return Result.success(user);
        } catch (Exception e) {
            return Result.error("查询失败：" + e.getMessage());
        }
    }

    @GetMapping("/dept/{deptId}")
    public Result<List<User>> getUsersByDeptId(@PathVariable Long deptId) {
        try {
            List<User> list = userService.getUsersByDeptId(deptId);
            return Result.success(list);
        } catch (Exception e) {
            return Result.error("查询失败：" + e.getMessage());
        }
    }

    @PostMapping
    public Result<String> createUser(@RequestBody User user) {
        try {
            userService.createUser(user);
            return Result.success("创建成功");
        } catch (Exception e) {
            return Result.error("创建失败：" + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public Result<String> updateUser(@PathVariable Long id, @RequestBody User user) {
        try {
            user.setId(id);
            userService.updateUser(user);
            return Result.success("更新成功");
        } catch (Exception e) {
            return Result.error("更新失败：" + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public Result<String> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return Result.success("删除成功");
        } catch (Exception e) {
            return Result.error("删除失败：" + e.getMessage());
        }
    }

    @PutMapping("/{id}/password")
    public Result<String> updatePassword(
            @PathVariable Long id,
            @RequestParam String oldPassword,
            @RequestParam String newPassword) {
        try {
            userService.updatePassword(id, oldPassword, newPassword);
            return Result.success("密码修改成功");
        } catch (Exception e) {
            return Result.error("密码修改失败：" + e.getMessage());
        }
    }

    @PutMapping("/{id}/admin-password")
    public Result<String> updatePasswordByAdmin(
            @PathVariable Long id,
            @RequestParam String newPassword) {
        try {
            userService.updatePasswordByAdmin(id, newPassword);
            return Result.success("密码修改成功");
        } catch (Exception e) {
            return Result.error("密码修改失败：" + e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    public Result<String> updateUserStatus(
            @PathVariable Long id,
            @RequestParam Integer status) {
        try {
            userService.updateUserStatus(id, status);
            return Result.success("状态更新成功");
        } catch (Exception e) {
            return Result.error("状态更新失败：" + e.getMessage());
        }
    }
}
