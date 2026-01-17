package com.campus.announce.mapper.user;

import com.campus.announce.entity.PasswordResetToken;
import org.apache.ibatis.annotations.Param;

public interface PasswordResetTokenMapper {

    int insert(PasswordResetToken token);

    PasswordResetToken selectByToken(String token);

    int deleteByUserId(Long userId);

    int deleteByToken(String token);

    int deleteExpiredTokens();
}