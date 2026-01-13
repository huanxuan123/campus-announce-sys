package com.campus.announce.service.impl;

import com.campus.announce.entity.Department;
import com.campus.announce.mapper.announcement.AnnouncementMapper;
import com.campus.announce.mapper.user.UserMapper;
import com.campus.announce.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    @Autowired
    private AnnouncementMapper announcementMapper;

    @Autowired
    private UserMapper userMapper;

    @Override
    public Department getDepartmentById(Long id) {
        return null;
    }

    @Override
    public Department getDepartmentByCode(String deptCode) {
        return null;
    }

    @Override
    public List<Department> getAllDepartments() {
        return null;
    }

    @Override
    @Transactional
    public int createDepartment(Department department) {
        return 0;
    }

    @Override
    @Transactional
    public int updateDepartment(Department department) {
        return 0;
    }

    @Override
    @Transactional
    public int deleteDepartment(Long id) {
        return 0;
    }
}
