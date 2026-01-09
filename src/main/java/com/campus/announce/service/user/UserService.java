package com.campus.announce.service.user;

import com.campus.announce.entity.User;

public interface UserService {
    
    User login(String username, String password);
    
    User getUserById(Long id);
    
    User getUserByUsername(String username);
    
    int createUser(User user);
    
    int updateUser(User user);
    
    int deleteUser(Long id);
    
    int updatePassword(Long id, String newPassword);
    
    int updateStatus(Long id, Integer status);
}