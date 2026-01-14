package com.campus.announce.service;

import java.util.List;
import java.util.Map;

public interface ConfigService {

    String getValueByKey(String configKey);

    Map<String, Object> getConfigByKey(String configKey);

    List<Map<String, Object>> getAllConfigs();

    int updateValue(String configKey, String configValue);

    int insertConfig(String configKey, String configValue, String configDesc);

    String getAnnouncementRetentionDays();

    String getMaxTopAnnouncements();

    String getMaxAttachmentSize();

    String getAllowedFileTypes();
}
