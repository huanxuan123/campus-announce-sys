package com.campus.announce.mapper.announcement;

import com.campus.announce.entity.Announcement;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;
import java.util.Map;

public interface AnnouncementMapper {
    
    Announcement selectById(Long id);
    
    List<Announcement> selectByCondition(Map<String, Object> params);
    
    List<Announcement> selectByScopeAndDept(@Param("scope") Integer scope, @Param("deptId") Long deptId);
    
    List<Announcement> selectTopAnnouncements(@Param("scope") Integer scope, @Param("deptId") Long deptId, @Param("limit") Integer limit);
    
    int insert(Announcement announcement);
    
    int update(Announcement announcement);
    
    int deleteById(Long id);
    
    int updateTopStatus(@Param("id") Long id, @Param("isTop") Integer isTop, @Param("topOrder") Integer topOrder);
    
    int incrementViewCount(Long id);
    
    int countByTypeAndDept(@Param("announcementType") Integer announcementType, @Param("deptId") Long deptId);
    
    int countByTimeRange(@Param("startTime") Date startTime, @Param("endTime") Date endTime, @Param("deptId") Long deptId);
}