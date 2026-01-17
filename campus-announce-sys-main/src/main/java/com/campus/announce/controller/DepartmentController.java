package com.campus.announce.controller;

import com.campus.announce.common.Result;
import com.campus.announce.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/department")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @GetMapping("/list")
    public Result<List> getDepartmentList() {
        try {
            List list = departmentService.getAllDepartments();
            return Result.success(list);
        } catch (Exception e) {
            return Result.error("查询失败：" + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public Result getDepartmentById(@PathVariable Long id) {
        try {
            Object department = departmentService.getDepartmentById(id);
            if (department == null) {
                return Result.error("院系不存在");
            }
            return Result.success(department);
        } catch (Exception e) {
            return Result.error("查询失败：" + e.getMessage());
        }
    }

    @PostMapping
    public Result<String> createDepartment(@RequestBody Object department) {
        try {
            departmentService.createDepartment((com.campus.announce.entity.Department) department);
            return Result.success("创建成功");
        } catch (Exception e) {
            return Result.error("创建失败：" + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public Result<String> updateDepartment(@PathVariable Long id, @RequestBody Object department) {
        try {
            com.campus.announce.entity.Department dept = (com.campus.announce.entity.Department) department;
            dept.setId(id);
            departmentService.updateDepartment(dept);
            return Result.success("更新成功");
        } catch (Exception e) {
            return Result.error("更新失败：" + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public Result<String> deleteDepartment(@PathVariable Long id) {
        try {
            departmentService.deleteDepartment(id);
            return Result.success("删除成功");
        } catch (Exception e) {
            return Result.error("删除失败：" + e.getMessage());
        }
    }
}
