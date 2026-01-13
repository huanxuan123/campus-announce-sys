package com.campus.announce.controller;

import com.campus.announce.common.Result;
import com.campus.announce.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/announcementType")
    public Result<List<Map<String, Object>>> countByAnnouncementType(
            @RequestParam(required = false) Long deptId) {
        try {
            List<Map<String, Object>> list = statisticsService.countByAnnouncementType(deptId);
            return Result.success(list);
        } catch (Exception e) {
            return Result.error("查询失败：" + e.getMessage());
        }
    }

    @GetMapping("/department")
    public Result<List<Map<String, Object>>> countByDepartment() {
        try {
            List<Map<String, Object>> list = statisticsService.countByDepartment();
            return Result.success(list);
        } catch (Exception e) {
            return Result.error("查询失败：" + e.getMessage());
        }
    }

    @GetMapping("/department/admin")
    public Result<List<Map<String, Object>>> countByDepartmentForDeptAdmin(
            @RequestParam Long deptId) {
        try {
            List<Map<String, Object>> list = statisticsService.countByDepartmentForDeptAdmin(deptId);
            return Result.success(list);
        } catch (Exception e) {
            return Result.error("查询失败：" + e.getMessage());
        }
    }

    @GetMapping("/timeRange")
    public Result<List<Map<String, Object>>> countByTimeRange(
            @RequestParam String startTime,
            @RequestParam String endTime,
            @RequestParam(required = false) Long deptId) {
        try {
            Date start = new Date(Long.parseLong(startTime));
            Date end = new Date(Long.parseLong(endTime));
            List<Map<String, Object>> list = statisticsService.countByTimeRange(start, end, deptId);
            return Result.success(list);
        } catch (Exception e) {
            return Result.error("查询失败：" + e.getMessage());
        }
    }

    @GetMapping("/total")
    public Result<Map<String, Object>> getTotalStatistics(
            @RequestParam(required = false) Long deptId) {
        try {
            Map<String, Object> map = statisticsService.getTotalStatistics(deptId);
            return Result.success(map);
        } catch (Exception e) {
            return Result.error("查询失败：" + e.getMessage());
        }
    }

    @GetMapping("/announcementRead")
    public Result<List<Map<String, Object>>> getAnnouncementReadStatistics(
            @RequestParam(required = false) Long announcementId) {
        try {
            List<Map<String, Object>> list = statisticsService.getAnnouncementReadStatistics(announcementId);
            return Result.success(list);
        } catch (Exception e) {
            return Result.error("查询失败：" + e.getMessage());
        }
    }

    @GetMapping("/departmentAnnouncement")
    public Result<List<Map<String, Object>>> getDepartmentAnnouncementStatistics() {
        try {
            List<Map<String, Object>> list = statisticsService.getDepartmentAnnouncementStatistics();
            return Result.success(list);
        } catch (Exception e) {
            return Result.error("查询失败：" + e.getMessage());
        }
    }
}
