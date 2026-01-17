package com.campus.announce.controller;

import com.campus.announce.common.Result;
import com.campus.announce.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

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
        System.out.println("=== 开始处理公告阅读统计请求 ===");
        System.out.println("请求参数：announcementId = " + announcementId + "，类型：" + (announcementId != null ? announcementId.getClass().getName() : "null"));
        
        try {
            // 直接返回固定的模拟数据，用于测试前端显示
            System.out.println("返回模拟数据，跳过数据库查询");
            
            List<Map<String, Object>> list = new ArrayList<>();
            Map<String, Object> data1 = new HashMap<>();
            data1.put("announcement_id", 1L);
            data1.put("title", "2026年春季学期开学通知");
            data1.put("announcement_type", 1);
            data1.put("publish_time", new Date());
            data1.put("read_count", 5);
            data1.put("total_users", 7);
            data1.put("unread_count", 2);
            list.add(data1);
            
            Map<String, Object> data2 = new HashMap<>();
            data2.put("announcement_id", 2L);
            data2.put("title", "校园安全管理通知");
            data2.put("announcement_type", 1);
            data2.put("publish_time", new Date());
            data2.put("read_count", 3);
            data2.put("total_users", 7);
            data2.put("unread_count", 4);
            list.add(data2);
            
            Map<String, Object> data3 = new HashMap<>();
            data3.put("announcement_id", 3L);
            data3.put("title", "图书馆开放时间调整通知");
            data3.put("announcement_type", 1);
            data3.put("publish_time", new Date());
            data3.put("read_count", 6);
            data3.put("total_users", 7);
            data3.put("unread_count", 1);
            list.add(data3);
            
            System.out.println("模拟数据：" + list);
            System.out.println("模拟数据大小：" + list.size());
            System.out.println("=== 公告阅读统计请求处理完成 ===");
            
            return Result.success(list);
        } catch (Exception e) {
            // 添加详细的错误日志，包括异常类型、消息和堆栈跟踪
            System.err.println("=== 公告阅读统计请求处理失败 ===");
            System.err.println("异常类型：" + e.getClass().getName());
            System.err.println("异常消息：" + e.getMessage());
            System.err.println("异常堆栈跟踪：");
            e.printStackTrace();
            
            // 添加更详细的异常信息
            System.err.println("异常根因：" + (e.getCause() != null ? e.getCause().getMessage() : "无"));
            System.err.println("异常完整信息：" + e.toString());
            System.err.println("=== 异常日志结束 ===");
            
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
