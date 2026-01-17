package com.campus.announce.service;

import com.campus.announce.entity.Department;

import java.util.List;

public interface DepartmentService {

    Department getDepartmentById(Long id);

    Department getDepartmentByCode(String deptCode);

    List<Department> getAllDepartments();

    int createDepartment(Department department);

    int updateDepartment(Department department);

    int deleteDepartment(Long id);
}
