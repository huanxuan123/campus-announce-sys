package com.campus.announce.service;

import com.campus.announce.entity.Announcement;

import java.util.List;
import java.util.Map;

public interface AnnouncementService {

    Announcement getAnnouncementById(Long id);

    List<Announcement> getAnnouncementList(Map<String, Object> params);

    List<Announcement> getAnnouncementsByScopeAndDept(Integer scope, Long deptId);

    List<Announcement> getTopAnnouncements(Integer scope, Long deptId, Integer limit);

    int createAnnouncement(Announcement announcement);

    int updateAnnouncement(Announcement announcement);

    int deleteAnnouncement(Long id);

    int setTopStatus(Long id, Integer isTop, Integer topOrder);

    int incrementViewCount(Long id);

    int countByTypeAndDept(Integer announcementType, Long deptId);

    int countByTimeRange(java.util.Date startTime, java.util.Date endTime, Long deptId);

    boolean markAsRead(Long announcementId, Long userId);

    boolean markAsUnread(Long announcementId, Long userId);

    boolean isRead(Long announcementId, Long userId);

    int getUnreadCount(Long userId, Integer scope, Long deptId);

    List<Announcement> getUnreadAnnouncements(Long userId, Integer scope, Long deptId);

    Map<String, Object> getReadStatistics(Long announcementId);
}
