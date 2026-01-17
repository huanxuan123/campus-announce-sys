package com.campus.announce.mapper.query;

import com.campus.announce.entity.Announcement;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface AnnouncementReadMapper {
    
    int insert(@Param("announcementId") Long announcementId, @Param("userId") Long userId);
    
    int delete(@Param("announcementId") Long announcementId, @Param("userId") Long userId);
    
    int countReadByAnnouncement(Long announcementId);
    
    int countUnreadByUser(@Param("userId") Long userId, @Param("scope") Integer scope, @Param("deptId") Long deptId);
    
    List<Announcement> selectUnreadAnnouncements(@Param("userId") Long userId, @Param("scope") Integer scope, @Param("deptId") Long deptId);
    
    boolean isRead(@Param("announcementId") Long announcementId, @Param("userId") Long userId);
    
    List<Map<String, Object>> selectReadStatistics(Long announcementId);
}