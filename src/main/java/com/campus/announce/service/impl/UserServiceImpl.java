package com.campus.announce.service.impl;

import com.campus.announce.entity.PasswordResetToken;
import com.campus.announce.entity.User;
import com.campus.announce.mapper.user.PasswordResetTokenMapper;
import com.campus.announce.mapper.user.UserMapper;
import com.campus.announce.service.EmailService;
import com.campus.announce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.mail.MessagingException;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordResetTokenMapper passwordResetTokenMapper;

    @Autowired
    private EmailService emailService;

    @Override
    public User login(String username, String password) {
        User user = userMapper.selectByUsername(username);
        if (user == null) {
            System.out.println("登录失败：用户不存在 - " + username);
            return null;
        }
        
        String dbPassword = user.getPassword();
        String inputPassword = password;
        
        System.out.println("登录调试 - 用户名: " + username);
        System.out.println("登录调试 - 数据库密码: [" + dbPassword + "] 长度: " + dbPassword.length());
        System.out.println("登录调试 - 输入密码: [" + inputPassword + "] 长度: " + inputPassword.length());
        System.out.println("登录调试 - 密码是否相等: " + inputPassword.equals(dbPassword));
        System.out.println("登录调试 - trim后是否相等: " + inputPassword.trim().equals(dbPassword.trim()));
        
        if (inputPassword.equals(dbPassword)) {
            System.out.println("登录成功: " + username);
            return user;
        }
        
        if (inputPassword.trim().equals(dbPassword.trim())) {
            System.out.println("登录成功（trim后）: " + username);
            return user;
        }
        
        System.out.println("登录失败：密码不匹配 - " + username);
        return null;
    }

    @Override
    @Transactional
    public User register(User user) {
        User existUser = userMapper.selectByUsername(user.getUsername().trim());
        if (existUser != null) {
            throw new RuntimeException("用户名已存在");
        }
        if (user.getStudentNo() != null) {
            User existStudent = userMapper.selectByStudentNo(user.getStudentNo().trim());
            if (existStudent != null) {
                throw new RuntimeException("学号/工号已存在");
            }
        }
        user.setUsername(user.getUsername().trim());
        user.setPassword(user.getPassword().trim());
        if (user.getStudentNo() != null) {
            user.setStudentNo(user.getStudentNo().trim());
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
        if (!oldPassword.trim().equals(user.getPassword().trim())) {
            throw new RuntimeException("原密码错误");
        }
        return userMapper.updatePassword(id, newPassword.trim());
    }

    @Override
    @Transactional
    public int updatePasswordByAdmin(Long id, String newPassword) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        return userMapper.updatePassword(id, newPassword.trim());
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

    @Override
    @Transactional
    public String sendPasswordResetEmail(String email) {
        User user = userMapper.selectByEmail(email);
        if (user == null) {
            throw new RuntimeException("该邮箱未注册");
        }
        if (user.getStatus() == 0) {
            throw new RuntimeException("该账号已被禁用");
        }

        passwordResetTokenMapper.deleteByUserId(user.getId());

        String token = UUID.randomUUID().toString();
        Date expiryDate = new Date(System.currentTimeMillis() + 30 * 60 * 1000);

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setUserId(user.getId());
        resetToken.setToken(token);
        resetToken.setExpiryDate(expiryDate);
        resetToken.setCreateTime(new Date());

        passwordResetTokenMapper.insert(resetToken);

        try {
            emailService.sendPasswordResetEmail(user.getEmail(), user.getUsername(), token);
        } catch (MessagingException e) {
            throw new RuntimeException("发送邮件失败：" + e.getMessage());
        }

        return user.getEmail();
    }

    @Override
    @Transactional
    public boolean resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenMapper.selectByToken(token);
        if (resetToken == null) {
            throw new RuntimeException("重置令牌无效");
        }

        if (resetToken.getExpiryDate().before(new Date())) {
            passwordResetTokenMapper.deleteByToken(token);
            throw new RuntimeException("重置令牌已过期");
        }

        int result = userMapper.updatePassword(resetToken.getUserId(), newPassword);
        passwordResetTokenMapper.deleteByToken(token);

        return result > 0;
    }
}
