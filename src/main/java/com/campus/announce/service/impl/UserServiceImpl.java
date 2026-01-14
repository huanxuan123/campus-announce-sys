package com.campus.announce.service.impl;

import com.campus.announce.entity.User;
import com.campus.announce.mapper.user.UserMapper;
import com.campus.announce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public User login(String username, String password) {
        User user = userMapper.selectByUsername(username);
        if (user == null) {
            return null;
        }
        if (password.equals(user.getPassword())) {
            return user;
        }
        return null;
    }

    @Override
    @Transactional
    public User register(User user) {
        User existUser = userMapper.selectByUsername(user.getUsername());
        if (existUser != null) {
            throw new RuntimeException("用户名已存在");
        }
        if (user.getStudentNo() != null) {
            User existStudent = userMapper.selectByStudentNo(user.getStudentNo());
            if (existStudent != null) {
                throw new RuntimeException("学号/工号已存在");
            }
        }
        userMapper.insert(user);
        return user;
    }

    @Override
    public User getUserById(Long id) {
        return userMapper.selectById(id);
    }

    @Override
    public User getUserByUsername(String username) {
        return userMapper.selectByUsername(username);
    }

    @Override
    public List<User> getUserList(Map<String, Object> params) {
        return userMapper.selectAll();
    }

    @Override
    public List<User> getUsersByDeptId(Long deptId) {
        return userMapper.selectByDeptId(deptId);
    }

    @Override
    @Transactional
    public int createUser(User user) {
        return userMapper.insert(user);
    }

    @Override
    @Transactional
    public int updateUser(User user) {
        return userMapper.update(user);
    }

    @Override
    @Transactional
    public int deleteUser(Long id) {
        return userMapper.deleteById(id);
    }

    @Override
    @Transactional
    public int updatePassword(Long id, String oldPassword, String newPassword) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        if (!oldPassword.equals(user.getPassword())) {
            throw new RuntimeException("原密码错误");
        }
        return userMapper.updatePassword(id, newPassword);
    }

    @Override
    @Transactional
    public int updatePasswordByAdmin(Long id, String newPassword) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        return userMapper.updatePassword(id, newPassword);
    }

    @Override
    @Transactional
    public int updateUserStatus(Long id, Integer status) {
        return userMapper.updateStatus(id, status);
    }

    @Override
    public List<User> getAllUsers() {
        return userMapper.selectAll();
    }
}
