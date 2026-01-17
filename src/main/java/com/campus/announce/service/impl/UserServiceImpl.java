package com.campus.announce.service.impl;

import com.campus.announce.entity.PasswordResetToken;
import com.campus.announce.entity.User;
import com.campus.announce.mapper.user.PasswordResetTokenMapper;
import com.campus.announce.mapper.user.UserMapper;
import com.campus.announce.service.EmailService;
import com.campus.announce.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordResetTokenMapper passwordResetTokenMapper;

    @Autowired
    private EmailService emailService;

    @Override
    public User login(String username, String password) {
        if (username == null || password == null) {
            logger.warn("登录失败：用户名或密码为空");
            return null;
        }
        
        // 清理输入
        username = username.trim();
        password = password.trim();
        
        User user = userMapper.selectByUsername(username);
        if (user == null) {
            logger.warn("登录失败：用户不存在 - {}", username);
            return null;
        }
        
        String dbPassword = user.getPassword();
        if (dbPassword == null) {
            logger.error("登录失败：数据库密码为空 - 用户ID: {}", user.getId());
            return null;
        }
        
        // 清理数据库密码（去除前后空格）
        dbPassword = dbPassword.trim();
        
        // 比较密码
        if (password.equals(dbPassword)) {
            logger.info("登录成功: {}", username);
            return user;
        }
        
        logger.warn("登录失败：密码不匹配 - {}", username);
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
        logger.info("Service层更新用户 - ID: {}, 用户名: {}, 真实姓名: {}, 类型: {}, 部门: {}, 邮箱: {}, 手机: {}, 状态: {}", 
                user.getId(), user.getUsername(), user.getRealName(), user.getUserType(),
                user.getDeptId(), user.getEmail(), user.getPhone(), user.getStatus());
        int result = userMapper.update(user);
        logger.info("Service层更新用户结果 - 影响行数: {}", result);
        return result;
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
