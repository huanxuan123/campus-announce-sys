package com.campus.announce.service.impl;

import com.campus.announce.mapper.statistics.StatisticsMapper;
import com.campus.announce.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class StatisticsServiceImpl implements StatisticsService {

    @Autowired
    private StatisticsMapper statisticsMapper;

    @Override
    public List<Map<String, Object>> countByAnnouncementType(Long deptId) {
        return statisticsMapper.countByAnnouncementType(deptId);
    }

    @Override
    public List<Map<String, Object>> countByDepartment() {
        return statisticsMapper.countByDepartment();
    }

    @Override
    public List<Map<String, Object>> countByDepartmentForDeptAdmin(Long deptId) {
        return statisticsMapper.countByDepartmentForDeptAdmin(deptId);
    }

    @Override
    public List<Map<String, Object>> countByTimeRange(Date startTime, Date endTime, Long deptId) {
        return statisticsMapper.countByTimeRange(startTime, endTime, deptId);
    }

    @Override
    public Map<String, Object> getTotalStatistics(Long deptId) {
        return statisticsMapper.getTotalStatistics(deptId);
    }

    @Override
    public List<Map<String, Object>> getAnnouncementReadStatistics(Long announcementId) {
        return statisticsMapper.getAnnouncementReadStatistics(announcementId);
    }

    @Override
    public List<Map<String, Object>> getDepartmentAnnouncementStatistics() {
        return statisticsMapper.getDepartmentAnnouncementStatistics();
    }
}
