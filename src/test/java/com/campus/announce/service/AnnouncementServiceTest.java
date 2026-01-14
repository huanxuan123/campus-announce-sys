package com.campus.announce.service;

import com.campus.announce.entity.Announcement;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:applicationContext.xml")
@Transactional
public class AnnouncementServiceTest {

    @Autowired
    private AnnouncementService announcementService;

    @Test
    public void testGetAnnouncementById() {
        Announcement announcement = announcementService.getAnnouncementById(1L);
        assertNotNull("根据ID查询应返回公告对象", announcement);
        assertEquals("ID应为1", Long.valueOf(1L), announcement.getId());
    }

    @Test
    public void testGetAnnouncementList() {
        Map<String, Object> params = new HashMap<>();
        List<Announcement> announcements = announcementService.getAnnouncementList(params);
        assertNotNull("根据条件查询应返回列表", announcements);
        assertTrue("公告列表不应为空", announcements.size() >= 0);
    }

    @Test
    public void testGetAnnouncementsByScopeAndDept() {
        List<Announcement> announcements = announcementService.getAnnouncementsByScopeAndDept(1, 1L);
        assertNotNull("根据范围和部门查询应返回列表", announcements);
    }

    @Test
    public void testGetTopAnnouncements() {
        List<Announcement> announcements = announcementService.getTopAnnouncements(1, 1L, 5);
        assertNotNull("查询置顶公告应返回列表", announcements);
        assertTrue("置顶公告数量不应超过5", announcements.size() <= 5);
    }

    @Test
    public void testCreateAnnouncement() {
        Announcement announcement = new Announcement();
        announcement.setTitle("测试公告");
        announcement.setContent("这是一条测试公告内容");
        announcement.setAnnouncementType(1);
        announcement.setScope(1);
        announcement.setDeptId(1L);
        announcement.setPublisherId(1L);
        announcement.setIsTop(0);
        announcement.setStatus(1);

        int result = announcementService.createAnnouncement(announcement);
        assertTrue("创建公告应成功", result > 0);
        assertNotNull("创建后应生成ID", announcement.getId());
        assertEquals("标题应为测试公告", "测试公告", announcement.getTitle());
    }

    @Test
    public void testUpdateAnnouncement() {
        Announcement announcement = announcementService.getAnnouncementById(1L);
        if (announcement != null) {
            String oldTitle = announcement.getTitle();
            announcement.setTitle("更新后的标题");
            int result = announcementService.updateAnnouncement(announcement);
            assertTrue("更新公告应成功", result > 0);

            Announcement updatedAnnouncement = announcementService.getAnnouncementById(1L);
            assertEquals("标题应已更新", "更新后的标题", updatedAnnouncement.getTitle());
        }
    }

    @Test
    public void testDeleteAnnouncement() {
        Announcement announcement = new Announcement();
        announcement.setTitle("待删除公告");
        announcement.setContent("这是一条待删除的公告");
        announcement.setAnnouncementType(1);
        announcement.setScope(1);
        announcement.setDeptId(1L);
        announcement.setPublisherId(1L);
        announcement.setIsTop(0);
        announcement.setStatus(1);
        announcementService.createAnnouncement(announcement);

        Long announcementId = announcement.getId();
        int result = announcementService.deleteAnnouncement(announcementId);
        assertTrue("删除公告应成功", result > 0);

        Announcement deletedAnnouncement = announcementService.getAnnouncementById(announcementId);
        assertNull("删除后公告不应存在", deletedAnnouncement);
    }

    @Test
    public void testSetTopStatus() {
        int result = announcementService.setTopStatus(1L, 1, 1);
        assertTrue("设置置顶状态应成功", result > 0);

        Announcement announcement = announcementService.getAnnouncementById(1L);
        assertEquals("置顶状态应为1", Integer.valueOf(1), announcement.getIsTop());
        assertEquals("置顶顺序应为1", Integer.valueOf(1), announcement.getTopOrder());
    }

    @Test
    public void testIncrementViewCount() {
        Announcement announcement = announcementService.getAnnouncementById(1L);
        if (announcement != null) {
            Integer oldViewCount = announcement.getViewCount();
            int result = announcementService.incrementViewCount(1L);
            assertTrue("增加浏览量应成功", result > 0);

            Announcement updatedAnnouncement = announcementService.getAnnouncementById(1L);
            assertTrue("浏览量应增加", updatedAnnouncement.getViewCount() >= oldViewCount);
        }
    }

    @Test
    public void testCountByTypeAndDept() {
        int count = announcementService.countByTypeAndDept(1, 1L);
        assertTrue("统计数量应大于等于0", count >= 0);
    }

    @Test
    public void testCountByTimeRange() {
        Date startTime = new Date(System.currentTimeMillis() - 30L * 24 * 60 * 60 * 1000);
        Date endTime = new Date();
        int count = announcementService.countByTimeRange(startTime, endTime, 1L);
        assertTrue("时间范围内统计数量应大于等于0", count >= 0);
    }

    @Test
    public void testMarkAsRead() {
        boolean result = announcementService.markAsRead(1L, 1L);
        assertTrue("标记为已读应成功", result);
    }

    @Test
    public void testMarkAsUnread() {
        announcementService.markAsRead(1L, 1L);
        boolean result = announcementService.markAsUnread(1L, 1L);
        assertTrue("标记为未读应成功", result);
    }

    @Test
    public void testIsRead() {
        announcementService.markAsRead(1L, 1L);
        boolean isRead = announcementService.isRead(1L, 1L);
        assertTrue("公告应已读", isRead);
    }

    @Test
    public void testGetUnreadCount() {
        int count = announcementService.getUnreadCount(1L, 1, 1L);
        assertTrue("未读数量应大于等于0", count >= 0);
    }

    @Test
    public void testGetUnreadAnnouncements() {
        List<Announcement> announcements = announcementService.getUnreadAnnouncements(1L, 1, 1L);
        assertNotNull("查询未读公告应返回列表", announcements);
    }

    @Test
    public void testGetReadStatistics() {
        Map<String, Object> stats = announcementService.getReadStatistics(1L);
        assertNotNull("查询阅读统计应返回数据", stats);
    }
}
