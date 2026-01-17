package com.campus.announce.service.statistics;

import java.util.Date;
import java.util.List;
import java.util.Map;

public interface StatisticsService {
    
    List<Map<String, Object>> countByAnnouncementType(Long deptId);
    
    List<Map<String, Object>> countByDepartment();
    
    List<Map<String, Object>> countByDepartmentForDeptAdmin(Long deptId);
    
    List<Map<String, Object>> countByTimeRange(Date startTime, Date endTime, Long deptId);
    
    Map<String, Object> getTotalStatistics(Long deptId);
    
    List<Map<String, Object>> getAnnouncementReadStatistics(Long announcementId);
    
    List<Map<String, Object>> getDepartmentAnnouncementStatistics();
    
    Map<String, Object> getAnnouncementReadUnreadCount(Long announcementId);
}