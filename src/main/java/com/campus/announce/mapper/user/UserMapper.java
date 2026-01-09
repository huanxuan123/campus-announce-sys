package com.campus.announce.mapper.user;

import com.campus.announce.entity.User;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface UserMapper {
    
    User selectById(Long id);
    
    User selectByUsername(String username);
    
    User selectByStudentNo(String studentNo);
    
    List<User> selectByDeptId(Long deptId);
    
    List<User> selectAll();
    
    int insert(User user);
    
    int update(User user);
    
    int deleteById(Long id);
    
    int updatePassword(@Param("id") Long id, @Param("newPassword") String newPassword);
    
    int updateStatus(@Param("id") Long id, @Param("status") Integer status);
}