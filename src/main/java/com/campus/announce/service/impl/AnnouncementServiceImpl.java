package com.campus.announce.service.impl;

import com.campus.announce.entity.Announcement;
import com.campus.announce.mapper.announcement.AnnouncementMapper;
import com.campus.announce.mapper.query.AnnouncementReadMapper;
import com.campus.announce.service.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class AnnouncementServiceImpl implements AnnouncementService {

    @Autowired
    private AnnouncementMapper announcementMapper;

    @Autowired
    private AnnouncementReadMapper announcementReadMapper;

    @Override
    public Announcement getAnnouncementById(Long id) {
        Announcement announcement = announcementMapper.selectById(id);
        if (announcement != null) {
            announcementMapper.incrementViewCount(id);
        }
        return announcement;
    }

    @Override
    public List<Announcement> getAnnouncementList(Map<String, Object> params) {
        return announcementMapper.selectByCondition(params);
    }

    @Override
    public List<Announcement> getAnnouncementsByScopeAndDept(Integer scope, Long deptId) {
        return announcementMapper.selectByScopeAndDept(scope, deptId);
    }

    @Override
    public List<Announcement> getTopAnnouncements(Integer scope, Long deptId, Integer limit) {
        return announcementMapper.selectTopAnnouncements(scope, deptId, limit);
    }

    @Override
    @Transactional
    public int createAnnouncement(Announcement announcement) {
        return announcementMapper.insert(announcement);
    }

    @Override
    @Transactional
    public int updateAnnouncement(Announcement announcement) {
        return announcementMapper.update(announcement);
    }

    @Override
    @Transactional
    public int deleteAnnouncement(Long id) {
        return announcementMapper.deleteById(id);
    }

    @Override
    @Transactional
    public int setTopStatus(Long id, Integer isTop, Integer topOrder) {
        return announcementMapper.updateTopStatus(id, isTop, topOrder);
    }

    @Override
    public int incrementViewCount(Long id) {
        return announcementMapper.incrementViewCount(id);
    }

    @Override
    public int countByTypeAndDept(Integer announcementType, Long deptId) {
        return announcementMapper.countByTypeAndDept(announcementType, deptId);
    }

    @Override
    public int countByTimeRange(java.util.Date startTime, java.util.Date endTime, Long deptId) {
        return announcementMapper.countByTimeRange(startTime, endTime, deptId);
    }

    @Override
    @Transactional
    public boolean markAsRead(Long announcementId, Long userId) {
        if (isRead(announcementId, userId)) {
            return true;
        }
        return announcementReadMapper.insert(announcementId, userId) > 0;
    }

    @Override
    @Transactional
    public boolean markAsUnread(Long announcementId, Long userId) {
        return announcementReadMapper.delete(announcementId, userId) > 0;
    }

    @Override
    public boolean isRead(Long announcementId, Long userId) {
        return announcementReadMapper.isRead(announcementId, userId);
    }

    @Override
    public int getUnreadCount(Long userId, Integer scope, Long deptId) {
        return announcementReadMapper.countUnreadByUser(userId, scope, deptId);
    }

    @Override
    public List<Announcement> getUnreadAnnouncements(Long userId, Integer scope, Long deptId) {
        return announcementReadMapper.selectUnreadAnnouncements(userId, scope, deptId);
    }

    @Override
    public Map<String, Object> getReadStatistics(Long announcementId) {
        List<Map<String, Object>> list = announcementReadMapper.selectReadStatistics(announcementId);
        return list.isEmpty() ? null : list.get(0);
    }
}
