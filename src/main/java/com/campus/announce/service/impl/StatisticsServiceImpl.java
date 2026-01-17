package com.campus.announce.service.impl;

import com.campus.announce.mapper.statistics.StatisticsMapper;
import com.campus.announce.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
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
        System.out.println("=== StatisticsServiceImpl.getAnnouncementReadStatistics 开始 ===");
        System.out.println("参数：announcementId = " + announcementId + "，类型：" + (announcementId != null ? announcementId.getClass().getName() : "null"));
        
        try {
            System.out.println("准备调用 statisticsMapper.getAnnouncementReadStatistics");
            
            // 调用Mapper查询数据库中的真实数据
            List<Map<String, Object>> result = statisticsMapper.getAnnouncementReadStatistics(announcementId);
            
            System.out.println("Mapper返回结果：" + result);
            System.out.println("Mapper返回结果大小：" + (result != null ? result.size() : "null"));
            System.out.println("=== StatisticsServiceImpl.getAnnouncementReadStatistics 结束 ===");
            
            return result;
        } catch (Exception e) {
            // 记录异常日志
            System.err.println("=== StatisticsServiceImpl.getAnnouncementReadStatistics 异常 ===");
            System.err.println("异常类型：" + e.getClass().getName());
            System.err.println("异常消息：" + e.getMessage());
            System.err.println("异常堆栈跟踪：");
            e.printStackTrace();
            
            // 添加更详细的异常信息
            System.err.println("异常根因：" + (e.getCause() != null ? e.getCause().getMessage() : "无"));
            System.err.println("异常完整信息：" + e.toString());
            
            // 检查是否是SQL语法错误
            if (e.getMessage().contains("SQL")) {
                System.err.println("这是一个SQL相关的异常");
            }
            
            // 检查是否是数据库连接错误
            if (e.getMessage().contains("Connection") || e.getMessage().contains("connect")) {
                System.err.println("这是一个数据库连接相关的异常");
            }
            
            System.err.println("=== 异常日志结束 ===");
            
            // 返回空列表，避免Controller层出现500错误
            System.out.println("异常处理：返回空列表");
            return new ArrayList<>();
        }
    }

    @Override
    public List<Map<String, Object>> getDepartmentAnnouncementStatistics() {
        return statisticsMapper.getDepartmentAnnouncementStatistics();
    }
}
