package com.campus.announce.service.query;

import com.campus.announce.entity.Announcement;

import java.util.List;
import java.util.Map;

public interface AnnouncementQueryService {
    
    List<Announcement> searchAnnouncements(Map<String, Object> params);
    
    Announcement getAnnouncementDetail(Long id);
    
    List<Announcement> getUnreadAnnouncements(Long userId, Integer scope, Long deptId);
    
    int getUnreadCount(Long userId, Integer scope, Long deptId);
    
    boolean markAsRead(Long announcementId, Long userId);
    
    List<Announcement> getAnnouncementsByScope(Integer scope, Long deptId);
    
    List<Announcement> getAnnouncementsByType(Integer announcementType, Integer scope, Long deptId);
    
    List<Announcement> getAnnouncementsByTimeRange(java.util.Date startTime, java.util.Date endTime, Integer scope, Long deptId);
}