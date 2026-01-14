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
            @RequestParam(required = false) String endTime,
            HttpSession session) {
        try {
            User user = (User) session.getAttribute("user");
            Map<String, Object> params = new HashMap<>();
            params.put("title", title);
            params.put("announcementType", announcementType);
            params.put("scope", scope);
            
            if (user != null) {
                if (user.getUserType() == 2) {
                    params.put("deptId", user.getDeptId());
                } else {
                    if (user.getUserType() == 3 || user.getUserType() == 4) {
                        if (deptId != null && !deptId.equals(user.getDeptId())) {
                            params.put("deptId", user.getDeptId());
                        }
                    }
                }
            }
            
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
            if (user.getUserType() == 3 || user.getUserType() == 4) {
                return Result.error("师生不能发布公告");
            }
            announcement.setPublisherId(user.getId());
            announcementService.createAnnouncementWithPermission(announcement, user.getUserType(), user.getDeptId());
            return Result.success("发布成功");
        } catch (Exception e) {
            return Result.error("发布失败：" + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public Result<String> updateAnnouncement(@PathVariable Long id, @RequestBody Announcement announcement, HttpSession session) {
        try {
            User user = (User) session.getAttribute("user");
            if (user == null) {
                return Result.error("请先登录");
            }
            if (user.getUserType() == 3 || user.getUserType() == 4) {
                return Result.error("师生不能修改公告");
            }
            announcement.setId(id);
            announcementService.updateAnnouncementWithPermission(announcement, user.getUserType(), user.getDeptId());
            return Result.success("更新成功");
        } catch (Exception e) {
            return Result.error("更新失败：" + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public Result<String> deleteAnnouncement(@PathVariable Long id, HttpSession session) {
        try {
            User user = (User) session.getAttribute("user");
            if (user == null) {
                return Result.error("请先登录");
            }
            if (user.getUserType() == 3 || user.getUserType() == 4) {
                return Result.error("师生不能删除公告");
            }
            announcementService.deleteAnnouncementWithPermission(id, user.getUserType(), user.getDeptId());
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
