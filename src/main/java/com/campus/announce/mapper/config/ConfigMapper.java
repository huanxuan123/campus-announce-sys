package com.campus.announce.mapper.config;

import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface ConfigMapper {

    String getValueByKey(@Param("configKey") String configKey);

    Map<String, Object> getConfigByKey(@Param("configKey") String configKey);

List<Map<String, Object>> getAllConfigs();

    int updateValue(@Param("configKey") String configKey, @Param("configValue") String configValue);
    
    int updateConfig(@Param("configKey") String configKey, @Param("configValue") String configValue);
    
    int insertConfig(@Param("configKey") String configKey, @Param("configValue") String configValue, @Param("configDesc") String configDesc);
}
