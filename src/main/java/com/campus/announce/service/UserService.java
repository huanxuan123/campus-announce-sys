package com.campus.announce.service;

import com.campus.announce.entity.User;

import java.util.List;
import java.util.Map;

public interface UserService {

    User login(String username, String password);

    User register(User user);

    User getUserById(Long id);

    User getUserByUsername(String username);

    List<User> getUserList(Map<String, Object> params);

    List<User> getUsersByDeptId(Long deptId);

    int createUser(User user);

    int updateUser(User user);

    int deleteUser(Long id);

    int updatePassword(Long id, String oldPassword, String newPassword);

    int updatePasswordByAdmin(Long id, String newPassword);

    int updateUserStatus(Long id, Integer status);

    List<User> getAllUsers();
}
