package com.campus.announce.service;

import com.campus.announce.entity.User;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:applicationContext.xml")
@Transactional
public class UserServiceTest {

    @Autowired
    private UserService userService;

    @Test
    public void testLoginSuccess() {
        User user = userService.login("admin", "$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH");
        assertNotNull("登录成功应返回用户对象", user);
        assertEquals("用户名应为admin", "admin", user.getUsername());
    }

    @Test
    public void testLoginWithWrongPassword() {
        User user = userService.login("admin", "wrongpassword");
        assertNull("密码错误应返回null", user);
    }

    @Test
    public void testLoginWithNonExistentUser() {
        User user = userService.login("nonexistent", "password");
        assertNull("用户不存在应返回null", user);
    }

    @Test
    public void testRegisterSuccess() {
        User newUser = new User();
        newUser.setUsername("testuser");
        newUser.setPassword("password123");
        newUser.setRealName("测试用户");
        newUser.setUserType(2);
        newUser.setStatus(1);

        User registeredUser = userService.register(newUser);
        assertNotNull("注册成功应返回用户对象", registeredUser);
        assertNotNull("注册成功应生成ID", registeredUser.getId());
        assertEquals("用户名应为testuser", "testuser", registeredUser.getUsername());
    }

    @Test(expected = RuntimeException.class)
    public void testRegisterWithExistingUsername() {
        User newUser = new User();
        newUser.setUsername("admin");
        newUser.setPassword("password123");
        newUser.setRealName("管理员");
        newUser.setUserType(2);
        newUser.setStatus(1);

        userService.register(newUser);
    }

    @Test
    public void testGetUserById() {
        User user = userService.getUserById(1L);
        assertNotNull("根据ID查询应返回用户对象", user);
        assertEquals("ID应为1", Long.valueOf(1L), user.getId());
    }

    @Test
    public void testGetUserByUsername() {
        User user = userService.getUserByUsername("admin");
        assertNotNull("根据用户名查询应返回用户对象", user);
        assertEquals("用户名应为admin", "admin", user.getUsername());
    }

    @Test
    public void testGetAllUsers() {
        List<User> users = userService.getAllUsers();
        assertNotNull("查询所有用户应返回列表", users);
        assertTrue("用户列表不应为空", users.size() > 0);
    }

    @Test
    public void testGetUserList() {
        Map<String, Object> params = new HashMap<>();
        List<User> users = userService.getUserList(params);
        assertNotNull("根据条件查询应返回列表", users);
    }

    @Test
    public void testCreateUser() {
        User newUser = new User();
        newUser.setUsername("newuser");
        newUser.setPassword("password123");
        newUser.setRealName("新用户");
        newUser.setUserType(2);
        newUser.setStatus(1);

        int result = userService.createUser(newUser);
        assertTrue("创建用户应成功", result > 0);
        assertNotNull("创建后应生成ID", newUser.getId());
    }

    @Test
    public void testUpdateUser() {
        User user = userService.getUserById(1L);
        if (user != null) {
            String oldName = user.getRealName();
            user.setRealName("更新后的姓名");
            int result = userService.updateUser(user);
            assertTrue("更新用户应成功", result > 0);

            User updatedUser = userService.getUserById(1L);
            assertEquals("姓名应已更新", "更新后的姓名", updatedUser.getRealName());
        }
    }

    @Test
    public void testUpdatePassword() {
        User user = userService.getUserById(1L);
        if (user != null) {
            String oldPassword = user.getPassword();
            int result = userService.updatePassword(1L, oldPassword, "newpassword123");
            assertTrue("更新密码应成功", result > 0);
        }
    }

    @Test(expected = RuntimeException.class)
    public void testUpdatePasswordWithWrongOldPassword() {
        userService.updatePassword(1L, "wrongpassword", "newpassword123");
    }

    @Test
    public void testUpdateUserStatus() {
        int result = userService.updateUserStatus(1L, 0);
        assertTrue("更新用户状态应成功", result > 0);

        User user = userService.getUserById(1L);
        assertEquals("用户状态应为0", Integer.valueOf(0), user.getStatus());
    }

    @Test
    public void testDeleteUser() {
        User newUser = new User();
        newUser.setUsername("todelete");
        newUser.setPassword("password123");
        newUser.setRealName("待删除用户");
        newUser.setUserType(2);
        newUser.setStatus(1);
        userService.createUser(newUser);

        Long userId = newUser.getId();
        int result = userService.deleteUser(userId);
        assertTrue("删除用户应成功", result > 0);

        User deletedUser = userService.getUserById(userId);
        assertNull("删除后用户不应存在", deletedUser);
    }
}
