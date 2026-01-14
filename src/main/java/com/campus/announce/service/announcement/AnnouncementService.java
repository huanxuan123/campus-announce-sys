package com.campus.announce.service.announcement;

import com.campus.announce.entity.Announcement;
import com.campus.announce.entity.Attachment;

import java.util.List;
import java.util.Map;

public interface AnnouncementService {
    
    Announcement createAnnouncement(Announcement announcement);
    
    int updateAnnouncement(Announcement announcement);
    
    int deleteAnnouncement(Long id);
    
    Announcement getAnnouncementById(Long id);
    
    List<Announcement> getAnnouncementList(Map<String, Object> params);
    
    List<Announcement> getAnnouncementsByCondition(Map<String, Object> params);
    
    List<Announcement> getAnnouncementsByScopeAndDept(Integer scope, Long deptId);
    
    List<Announcement> getTopAnnouncements(Integer scope, Long deptId, Integer limit);
    
    int setTopStatus(Long id, Integer isTop, Integer topOrder);
    
    int incrementViewCount(Long id);
    
    Attachment uploadAttachment(Attachment attachment);
    
    int deleteAttachment(Long id);
    
    List<Attachment> getAttachmentsByAnnouncementId(Long announcementId);
    
    void markAsRead(Long announcementId, Long userId);
}