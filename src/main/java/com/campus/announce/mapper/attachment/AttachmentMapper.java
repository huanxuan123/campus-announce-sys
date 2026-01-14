package com.campus.announce.mapper.attachment;

import com.campus.announce.entity.Attachment;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface AttachmentMapper {

    Attachment selectById(Long id);

    List<Attachment> selectByAnnouncementId(Long announcementId);

    int insert(Attachment attachment);

    int deleteById(Long id);

    int deleteByAnnouncementId(Long announcementId);
}
