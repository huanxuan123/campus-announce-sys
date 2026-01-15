package com.campus.announce.controller;

import com.campus.announce.common.Result;
import com.campus.announce.entity.Announcement;
import com.campus.announce.entity.User;
import com.campus.announce.service.AnnouncementService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/announcement")
public class AnnouncementController {

    private static final Logger logger = LoggerFactory.getLogger(AnnouncementController.class);

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
            logger.info("=== 获取公告列表 ===");
            User user = (User) session.getAttribute("user");
            logger.info("当前用户: {}", user != null ? user.getUsername() : "未登录");
            
            Map<String, Object> params = new HashMap<>();
            params.put("title", title);
            params.put("announcementType", announcementType);
            params.put("scope", scope);
            
            if (user != null) {
                if (user.getUserType() == 2) {
                    params.put("deptId", user.getDeptId());
                    logger.info("院系管理员，限制部门ID: {}", user.getDeptId());
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
            
            logger.debug("查询参数: {}", params);
            List<Announcement> list = announcementService.getAnnouncementList(params);
            logger.info("查询到 {} 条公告", list != null ? list.size() : 0);
            
            // 限制content长度，避免响应过大
            if (list != null) {
                for (Announcement ann : list) {
                    if (ann.getContent() != null && ann.getContent().length() > 500) {
                        ann.setContent(ann.getContent().substring(0, 500) + "...");
                    }
                }
            }
            
            return Result.success(list);
        } catch (Exception e) {
            logger.error("查询公告列表异常", e);
            return Result.error("查询失败：" + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public Result<Announcement> getAnnouncementById(@PathVariable Long id, HttpSession session) {
        try {
            logger.info("获取公告详情 - ID: {}", id);
            Announcement announcement = announcementService.getAnnouncementById(id);
            if (announcement == null) {
                logger.warn("公告不存在 - ID: {}", id);
                return Result.error("公告不存在");
            }
            User user = (User) session.getAttribute("user");
            if (user != null) {
                announcementService.markAsRead(id, user.getId());
                logger.debug("用户 {} 标记公告 {} 为已读", user.getUsername(), id);
            }
            return Result.success(announcement);
        } catch (Exception e) {
            logger.error("获取公告详情失败 - ID: {}", id, e);
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
                logger.warn("未登录用户尝试发布公告");
                return Result.error("请先登录");
            }
            if (user.getUserType() == 3 || user.getUserType() == 4) {
                logger.warn("用户 {} (类型: {}) 尝试发布公告，被拒绝", user.getUsername(), user.getUserType());
                return Result.error("师生不能发布公告");
            }
            logger.info("用户 {} 发布公告 - 标题: {}", user.getUsername(), announcement.getTitle());
            announcement.setPublisherId(user.getId());
            announcementService.createAnnouncementWithPermission(announcement, user.getUserType(), user.getDeptId());
            logger.info("公告发布成功 - ID: {}", announcement.getId());
            return Result.success("发布成功");
        } catch (Exception e) {
            logger.error("发布公告失败", e);
            return Result.error("发布失败：" + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public Result<String> updateAnnouncement(@PathVariable Long id, @RequestBody Announcement announcement, HttpSession session) {
        try {
            User user = (User) session.getAttribute("user");
            if (user == null) {
                logger.warn("未登录用户尝试修改公告 - ID: {}", id);
                return Result.error("请先登录");
            }
            if (user.getUserType() == 3 || user.getUserType() == 4) {
                logger.warn("用户 {} (类型: {}) 尝试修改公告 {}，被拒绝", user.getUsername(), user.getUserType(), id);
                return Result.error("师生不能修改公告");
            }
            announcement.setId(id);
            logger.info("用户 {} 修改公告 {} - 数据: {}", user.getUsername(), id, announcement);
            int result = announcementService.updateAnnouncementWithPermission(announcement, user.getUserType(), user.getDeptId());
            logger.info("公告修改结果 - 影响行数: {}", result);
            return Result.success("更新成功");
        } catch (Exception e) {
            logger.error("更新公告失败 - ID: {}", id, e);
            return Result.error("更新失败：" + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public Result<String> deleteAnnouncement(@PathVariable Long id, HttpSession session) {
        try {
            User user = (User) session.getAttribute("user");
            if (user == null) {
                logger.warn("未登录用户尝试删除公告 - ID: {}", id);
                return Result.error("请先登录");
            }
            if (user.getUserType() == 3 || user.getUserType() == 4) {
                logger.warn("用户 {} (类型: {}) 尝试删除公告 {}，被拒绝", user.getUsername(), user.getUserType(), id);
                return Result.error("师生不能删除公告");
            }
            logger.info("用户 {} 删除公告 - ID: {}", user.getUsername(), id);
            announcementService.deleteAnnouncementWithPermission(id, user.getUserType(), user.getDeptId());
            logger.info("公告删除成功 - ID: {}", id);
            return Result.success("删除成功");
        } catch (Exception e) {
            logger.error("删除公告失败 - ID: {}", id, e);
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
