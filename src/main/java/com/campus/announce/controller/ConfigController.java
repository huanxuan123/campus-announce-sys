package com.campus.announce.controller;

import com.campus.announce.common.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/config")
public class ConfigController {

    @GetMapping("/announcementTypes")
    public Result<List<Map<String, Object>>> getAnnouncementTypes() {
        List<Map<String, Object>> types = new ArrayList<>();
        
        Map<String, Object> type1 = new HashMap<>();
        type1.put("value", 1);
        type1.put("label", "通知");
        types.add(type1);
        
        Map<String, Object> type2 = new HashMap<>();
        type2.put("value", 2);
        type2.put("label", "活动");
        types.add(type2);
        
        Map<String, Object> type3 = new HashMap<>();
        type3.put("value", 3);
        type3.put("label", "其他");
        types.add(type3);
        
        return Result.success(types);
    }

    @GetMapping("/userTypes")
    public Result<List<Map<String, Object>>> getUserTypes() {
        List<Map<String, Object>> types = new ArrayList<>();
        
        Map<String, Object> type1 = new HashMap<>();
        type1.put("value", 1);
        type1.put("label", "系统管理员");
        types.add(type1);
        
        Map<String, Object> type2 = new HashMap<>();
        type2.put("value", 2);
        type2.put("label", "部门管理员");
        types.add(type2);
        
        Map<String, Object> type3 = new HashMap<>();
        type3.put("value", 3);
        type3.put("label", "教师");
        types.add(type3);
        
        Map<String, Object> type4 = new HashMap<>();
        type4.put("value", 4);
        type4.put("label", "学生");
        types.add(type4);
        
        return Result.success(types);
    }

    @GetMapping("/scopes")
    public Result<List<Map<String, Object>>> getScopes() {
        List<Map<String, Object>> scopes = new ArrayList<>();
        
        Map<String, Object> scope1 = new HashMap<>();
        scope1.put("value", 1);
        scope1.put("label", "全校");
        scopes.add(scope1);
        
        Map<String, Object> scope2 = new HashMap<>();
        scope2.put("value", 2);
        scope2.put("label", "部门");
        scopes.add(scope2);
        
        return Result.success(scopes);
    }

    @GetMapping("/userStatuses")
    public Result<List<Map<String, Object>>> getUserStatuses() {
        List<Map<String, Object>> statuses = new ArrayList<>();
        
        Map<String, Object> status1 = new HashMap<>();
        status1.put("value", 0);
        status1.put("label", "禁用");
        statuses.add(status1);
        
        Map<String, Object> status2 = new HashMap<>();
        status2.put("value", 1);
        status2.put("label", "启用");
        statuses.add(status2);
        
        return Result.success(statuses);
    }

    @GetMapping("/announcementStatuses")
    public Result<List<Map<String, Object>>> getAnnouncementStatuses() {
        List<Map<String, Object>> statuses = new ArrayList<>();
        
        Map<String, Object> status1 = new HashMap<>();
        status1.put("value", 0);
        status1.put("label", "草稿");
        statuses.add(status1);
        
        Map<String, Object> status2 = new HashMap<>();
        status2.put("value", 1);
        status2.put("label", "已发布");
        statuses.add(status2);
        
        return Result.success(statuses);
    }

    @GetMapping("/all")
    public Result<Map<String, Object>> getAllConfigs() {
        Map<String, Object> configs = new HashMap<>();
        configs.put("announcementTypes", getAnnouncementTypes().getData());
        configs.put("userTypes", getUserTypes().getData());
        configs.put("scopes", getScopes().getData());
        configs.put("userStatuses", getUserStatuses().getData());
        configs.put("announcementStatuses", getAnnouncementStatuses().getData());
        return Result.success(configs);
    }
}
