package com.campus.announce.service;

import com.campus.announce.entity.Department;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:applicationContext.xml")
@Transactional
public class DepartmentServiceTest {

    @Autowired
    private DepartmentService departmentService;

    @Test
    public void testGetDepartmentById() {
        Department department = departmentService.getDepartmentById(1L);
        assertNotNull("根据ID查询应返回部门对象", department);
        assertEquals("ID应为1", Long.valueOf(1L), department.getId());
    }

    @Test
    public void testGetDepartmentByCode() {
        Department department = departmentService.getDepartmentByCode("CS");
        assertNotNull("根据部门编码查询应返回部门对象", department);
        assertEquals("部门编码应为CS", "CS", department.getDeptCode());
    }

    @Test
    public void testGetAllDepartments() {
        List<Department> departments = departmentService.getAllDepartments();
        assertNotNull("查询所有部门应返回列表", departments);
        assertTrue("部门列表不应为空", departments.size() > 0);
    }

    @Test
    public void testCreateDepartment() {
        Department newDept = new Department();
        newDept.setDeptName("测试部门");
        newDept.setDeptCode("TEST");

        int result = departmentService.createDepartment(newDept);
        assertTrue("创建部门应成功", result > 0);
        assertNotNull("创建后应生成ID", newDept.getId());
        assertEquals("部门名称应为测试部门", "测试部门", newDept.getDeptName());
    }

    @Test(expected = RuntimeException.class)
    public void testCreateDepartmentWithExistingCode() {
        Department newDept = new Department();
        newDept.setDeptName("计算机学院");
        newDept.setDeptCode("CS");

        departmentService.createDepartment(newDept);
    }

    @Test
    public void testUpdateDepartment() {
        Department department = departmentService.getDepartmentById(1L);
        if (department != null) {
            String oldName = department.getDeptName();
            department.setDeptName("更新后的部门名称");
            int result = departmentService.updateDepartment(department);
            assertTrue("更新部门应成功", result > 0);

            Department updatedDept = departmentService.getDepartmentById(1L);
            assertEquals("部门名称应已更新", "更新后的部门名称", updatedDept.getDeptName());
        }
    }

    @Test(expected = RuntimeException.class)
    public void testUpdateDepartmentWithExistingCode() {
        Department department = departmentService.getDepartmentById(1L);
        if (department != null) {
            Department otherDept = departmentService.getDepartmentById(2L);
            if (otherDept != null) {
                department.setDeptCode(otherDept.getDeptCode());
                departmentService.updateDepartment(department);
            }
        }
    }

    @Test
    public void testDeleteDepartment() {
        Department newDept = new Department();
        newDept.setDeptName("待删除部门");
        newDept.setDeptCode("DEL");
        departmentService.createDepartment(newDept);

        Long deptId = newDept.getId();
        int result = departmentService.deleteDepartment(deptId);
        assertTrue("删除部门应成功", result > 0);

        Department deletedDept = departmentService.getDepartmentById(deptId);
        assertNull("删除后部门不应存在", deletedDept);
    }

    @Test(expected = RuntimeException.class)
    public void testDeleteNonExistentDepartment() {
        departmentService.deleteDepartment(99999L);
    }
}
