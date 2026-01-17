package com.campus.announce.mapper.statistics;

import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;
import java.util.Map;

public interface StatisticsMapper {
    
    List<Map<String, Object>> countByAnnouncementType(@Param("deptId") Long deptId);
    
    List<Map<String, Object>> countByDepartment();
    
    List<Map<String, Object>> countByDepartmentForDeptAdmin(@Param("deptId") Long deptId);
    
    List<Map<String, Object>> countByTimeRange(@Param("startTime") Date startTime, @Param("endTime") Date endTime, @Param("deptId") Long deptId);
    
    Map<String, Object> getTotalStatistics(@Param("deptId") Long deptId);
    
    List<Map<String, Object>> getAnnouncementReadStatistics(@Param("announcementId") Long announcementId);
    
    List<Map<String, Object>> getDepartmentAnnouncementStatistics();
}