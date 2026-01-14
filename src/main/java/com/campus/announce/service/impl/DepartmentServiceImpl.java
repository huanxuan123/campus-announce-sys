package com.campus.announce.service.impl;

import com.campus.announce.entity.Department;
import com.campus.announce.mapper.announcement.AnnouncementMapper;
import com.campus.announce.mapper.department.DepartmentMapper;
import com.campus.announce.mapper.user.UserMapper;
import com.campus.announce.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    @Autowired
    private DepartmentMapper departmentMapper;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private AnnouncementMapper announcementMapper;

    @Override
    public Department getDepartmentById(Long id) {
        return departmentMapper.selectById(id);
    }

    @Override
    public Department getDepartmentByCode(String deptCode) {
        return departmentMapper.selectByCode(deptCode);
    }

    @Override
    public List<Department> getAllDepartments() {
        return departmentMapper.selectAll();
    }

    @Override
    @Transactional
    public int createDepartment(Department department) {
        Department existDept = departmentMapper.selectByCode(department.getDeptCode());
        if (existDept != null) {
            throw new RuntimeException("部门编码已存在");
        }
        return departmentMapper.insert(department);
    }

    @Override
    @Transactional
    public int updateDepartment(Department department) {
        Department existDept = departmentMapper.selectByCode(department.getDeptCode());
        if (existDept != null && !existDept.getId().equals(department.getId())) {
            throw new RuntimeException("部门编码已被其他部门使用");
        }
        return departmentMapper.update(department);
    }

    @Override
    @Transactional
    public int deleteDepartment(Long id) {
        Department department = departmentMapper.selectById(id);
        if (department == null) {
            throw new RuntimeException("部门不存在");
        }
        return departmentMapper.deleteById(id);
    }
}
