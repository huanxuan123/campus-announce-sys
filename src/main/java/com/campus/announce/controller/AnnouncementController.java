package com.campus.announce.controller;

import com.campus.announce.common.Result;
import com.campus.announce.entity.Announcement;
import com.campus.announce.entity.User;
import com.campus.announce.service.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/announcement")
public class AnnouncementController {

    @Autowired
    private AnnouncementService announcementService;

    @GetMapping("/list")
    public Result<List<Announcement>> getAnnouncementList(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Integer announcementType,
            @RequestParam(required = false) Integer scope,
            @RequestParam(required = false) Long deptId,
            @RequestParam(required = false) String startTime,
            @RequestParam(required = false) String endTime) {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("title", title);
            params.put("announcementType", announcementType);
            params.put("scope", scope);
            params.put("deptId", deptId);
            params.put("startTime", startTime);
            params.put("endTime", endTime);
            
            List<Announcement> list = announcementService.getAnnouncementList(params);
            return Result.success(list);
        } catch (Exception e) {
            return Result.error("查询失败：" + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public Result<Announcement> getAnnouncementById(@PathVariable Long id, HttpSession session) {
        try {
            Announcement announcement = announcementService.getAnnouncementById(id);
            if (announcement == null) {
                return Result.error("公告不存在");
            }
            User user = (User) session.getAttribute("user");
            if (user != null) {
                announcementService.markAsRead(id, user.getId());
            }
            return Result.success(announcement);
        } catch (Exception e) {
            return Result.error("查询失败：" + e.getMessage());
        }
    }

    @GetMapping("/scope/{scope}")
    public Result<List<Announcement>> getAnnouncementsByScope(
            @PathVariable Integer scope,
            @RequestParam(required = false) Long deptId) {
        try {
            List<Announcement> list = announcementService.getAnnouncementsByScopeAndDept(scope, deptId);
            return Result.success(list);
        } catch (Exception e) {
            return Result.error("查询失败：" + e.getMessage());
        }
    }

    @GetMapping("/top")
    public Result<List<Announcement>> getTopAnnouncements(
            @RequestParam Integer scope,
            @RequestParam(required = false) Long deptId,
            @RequestParam(defaultValue = "5") Integer limit) {
        try {
            List<Announcement> list = announcementService.getTopAnnouncements(scope, deptId, limit);
            return Result.success(list);
        } catch (Exception e) {
            return Result.error("查询失败：" + e.getMessage());
        }
    }

    @PostMapping
    public Result<String> createAnnouncement(@RequestBody Announcement announcement, HttpSession session) {
        try {
            User user = (User) session.getAttribute("user");
            if (user == null) {
                return Result.error("请先登录");
            }
            announcement.setPublisherId(user.getId());
            announcementService.createAnnouncement(announcement);
            return Result.success("发布成功");
        } catch (Exception e) {
            return Result.error("发布失败：" + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public Result<String> updateAnnouncement(@PathVariable Long id, @RequestBody Announcement announcement) {
        try {
            announcement.setId(id);
            announcementService.updateAnnouncement(announcement);
            return Result.success("更新成功");
        } catch (Exception e) {
            return Result.error("更新失败：" + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public Result<String> deleteAnnouncement(@PathVariable Long id) {
        try {
            announcementService.deleteAnnouncement(id);
            return Result.success("删除成功");
        } catch (Exception e) {
            return Result.error("删除失败：" + e.getMessage());
        }
    }

    @PutMapping("/{id}/top")
    public Result<String> setTopStatus(
            @PathVariable Long id,
            @RequestParam Integer isTop,
            @RequestParam(required = false) Integer topOrder) {
        try {
            announcementService.setTopStatus(id, isTop, topOrder);
            return Result.success("设置成功");
        } catch (Exception e) {
            return Result.error("设置失败：" + e.getMessage());
        }
    }

    @PostMapping("/{id}/read")
    public Result<String> markAsRead(@PathVariable Long id, HttpSession session) {
        try {
            User user = (User) session.getAttribute("user");
            if (user == null) {
                return Result.error("请先登录");
            }
            announcementService.markAsRead(id, user.getId());
            return Result.success("标记成功");
        } catch (Exception e) {
            return Result.error("标记失败：" + e.getMessage());
        }
    }

    @GetMapping("/unread")
    public Result<List<Announcement>> getUnreadAnnouncements(
            @RequestParam Integer scope,
            @RequestParam(required = false) Long deptId,
            HttpSession session) {
        try {
            User user = (User) session.getAttribute("user");
            if (user == null) {
                return Result.error("请先登录");
            }
            List<Announcement> list = announcementService.getUnreadAnnouncements(user.getId(), scope, deptId);
            return Result.success(list);
        } catch (Exception e) {
            return Result.error("查询失败：" + e.getMessage());
        }
    }

    @GetMapping("/unread/count")
    public Result<Integer> getUnreadCount(
            @RequestParam Integer scope,
            @RequestParam(required = false) Long deptId,
            HttpSession session) {
        try {
            User user = (User) session.getAttribute("user");
            if (user == null) {
                return Result.error("请先登录");
            }
            int count = announcementService.getUnreadCount(user.getId(), scope, deptId);
            return Result.success(count);
        } catch (Exception e) {
            return Result.error("查询失败：" + e.getMessage());
        }
    }
}
