package com.campus.announce.mapper.department;

import com.campus.announce.entity.Department;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface DepartmentMapper {

    Department selectById(@Param("id") Long id);

    Department selectByCode(@Param("deptCode") String deptCode);

    List<Department> selectAll();

    int insert(Department department);

    int update(Department department);

    int deleteById(@Param("id") Long id);

    int countByCode(@Param("deptCode") String deptCode);
}
