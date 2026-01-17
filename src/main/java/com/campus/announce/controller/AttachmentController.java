package com.campus.announce.controller;

import com.campus.announce.common.Result;
import com.campus.announce.entity.Attachment;
import com.campus.announce.mapper.attachment.AttachmentMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/attachment")
public class AttachmentController {

    @Autowired
    private AttachmentMapper attachmentMapper;

    @Value("${upload.path}")
    private String uploadPath;

    @Value("${upload.maxSize}")
    private Long maxSize;

    @Value("${upload.allowedTypes}")
    private String allowedTypes;

    @PostMapping("/upload")
    public Result<Map<String, Object>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("announcementId") Long announcementId,
            HttpServletRequest request) {
        try {
            if (file.isEmpty()) {
                return Result.error("文件不能为空");
            }

            String fileName = file.getOriginalFilename();
            String fileExt = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();

            if (!isAllowedType(fileExt)) {
                return Result.error("不支持的文件类型");
            }

            if (file.getSize() > maxSize) {
                return Result.error("文件大小超过限制");
            }

            String datePath = new SimpleDateFormat("yyyy/MM/dd").format(new Date());
            String relativePath = datePath + "/" + UUID.randomUUID().toString() + "." + fileExt;
            String fullPath = uploadPath + relativePath;

            File destFile = new File(fullPath);
            destFile.getParentFile().mkdirs();
            file.transferTo(destFile);

            Attachment attachment = new Attachment();
            attachment.setAnnouncementId(announcementId);
            attachment.setFileName(fileName);
            attachment.setFilePath(relativePath);
            attachment.setFileSize(file.getSize());
            attachment.setFileType(fileExt);

            attachmentMapper.insert(attachment);

            Map<String, Object> result = new HashMap<>();
            result.put("id", attachment.getId());
            result.put("fileName", fileName);
            result.put("filePath", relativePath);
            result.put("fileSize", file.getSize());

            return Result.success("上传成功", result);
        } catch (IOException e) {
            return Result.error("文件上传失败：" + e.getMessage());
        }
    }

    @GetMapping("/list/{announcementId}")
    public Result<List<Attachment>> getAttachmentsByAnnouncementId(@PathVariable Long announcementId) {
        try {
            List<Attachment> attachments = attachmentMapper.selectByAnnouncementId(announcementId);
            return Result.success(attachments);
        } catch (Exception e) {
            return Result.error("查询失败：" + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public Result<String> deleteAttachment(@PathVariable Long id) {
        try {
            Attachment attachment = attachmentMapper.selectById(id);
            if (attachment == null) {
                return Result.error("附件不存在");
            }

            String fullPath = uploadPath + attachment.getFilePath();
            File file = new File(fullPath);
            if (file.exists()) {
                file.delete();
            }

            attachmentMapper.deleteById(id);
            return Result.success("删除成功");
        } catch (Exception e) {
            return Result.error("删除失败：" + e.getMessage());
        }
    }

    private boolean isAllowedType(String fileExt) {
        if (allowedTypes == null || allowedTypes.isEmpty()) {
            return true;
        }
        List<String> types = Arrays.asList(allowedTypes.split(","));
        return types.contains(fileExt.toLowerCase());
    }
}
