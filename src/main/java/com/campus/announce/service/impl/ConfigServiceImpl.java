package com.campus.announce.service.impl;

import com.campus.announce.mapper.config.ConfigMapper;
import com.campus.announce.service.ConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ConfigServiceImpl implements ConfigService {

    @Autowired
    private ConfigMapper configMapper;

    @Override
    public String getValueByKey(String configKey) {
        return configMapper.getValueByKey(configKey);
    }

    @Override
    public Map<String, Object> getConfigByKey(String configKey) {
        return configMapper.getConfigByKey(configKey);
    }

    @Override
    public List<Map<String, Object>> getAllConfigs() {
        return configMapper.getAllConfigs();
    }

    @Override
    public int updateValue(String configKey, String configValue) {
        return configMapper.updateValue(configKey, configValue);
    }

    @Override
    public int insertConfig(String configKey, String configValue, String configDesc) {
        return configMapper.insertConfig(configKey, configValue, configDesc);
    }

    @Override
    public String getAnnouncementRetentionDays() {
        return getValueByKey("announcement_retention_days");
    }

    @Override
    public String getMaxTopAnnouncements() {
        return getValueByKey("max_top_announcements");
    }

    @Override
    public String getMaxAttachmentSize() {
        return getValueByKey("max_attachment_size");
    }

    @Override
    public String getAllowedFileTypes() {
        return getValueByKey("allowed_file_types");
    }
}
