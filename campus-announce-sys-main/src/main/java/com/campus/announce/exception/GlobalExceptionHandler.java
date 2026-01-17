package com.campus.announce.exception;

import com.campus.announce.common.Result;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.servlet.http.HttpServletRequest;
import java.util.stream.Collectors;

/**
 * 全局异常处理器
 * 统一处理所有Controller层的异常，提供友好的错误提示和详细的日志记录
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * 处理运行时异常
     */
    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Result<String> handleRuntimeException(RuntimeException e, HttpServletRequest request) {
        logError("运行时异常", request, e);
        return Result.error("操作失败：" + e.getMessage());
    }

    /**
     * 处理参数异常
     */
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<String> handleIllegalArgumentException(IllegalArgumentException e, HttpServletRequest request) {
        logWarn("参数异常", request, e);
        return Result.error("参数错误：" + e.getMessage());
    }

    /**
     * 处理参数验证异常
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<String> handleMethodArgumentNotValidException(MethodArgumentNotValidException e, HttpServletRequest request) {
        String errors = e.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));
        logWarn("参数验证失败", request, e);
        return Result.error("参数验证失败：" + errors);
    }

    /**
     * 处理缺少请求参数异常
     */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<String> handleMissingServletRequestParameterException(MissingServletRequestParameterException e, HttpServletRequest request) {
        logWarn("缺少请求参数", request, e);
        return Result.error("缺少必需参数：" + e.getParameterName());
    }

    /**
     * 处理数据库访问异常
     */
    @ExceptionHandler(DataAccessException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Result<String> handleDataAccessException(DataAccessException e, HttpServletRequest request) {
        logError("数据库访问异常", request, e);
        
        // 根据不同的数据库异常类型返回不同的错误信息
        if (e instanceof DuplicateKeyException) {
            return Result.error("数据已存在，不能重复添加");
        } else if (e instanceof DataIntegrityViolationException) {
            return Result.error("数据完整性约束 violation，请检查数据");
        } else {
            return Result.error("数据库操作失败，请稍后重试");
        }
    }

    /**
     * 处理空指针异常
     */
    @ExceptionHandler(NullPointerException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Result<String> handleNullPointerException(NullPointerException e, HttpServletRequest request) {
        logError("空指针异常", request, e);
        return Result.error("系统内部错误：空指针异常");
    }

    /**
     * 处理所有其他异常
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Result<String> handleException(Exception e, HttpServletRequest request) {
        logError("系统异常", request, e);
        
        // 生产环境不暴露详细错误信息
        String message = "系统错误，请联系管理员";
        // 开发环境可以返回详细错误
        if (logger.isDebugEnabled()) {
            message = "系统错误：" + e.getMessage();
        }
        return Result.error(message);
    }

    /**
     * 记录错误日志（带详细信息）
     */
    private void logError(String type, HttpServletRequest request, Exception e) {
        logger.error("{} - URI: {}, Method: {}, IP: {}, User-Agent: {}, 错误: {}", 
                type,
                request.getRequestURI(),
                request.getMethod(),
                getClientIp(request),
                request.getHeader("User-Agent"),
                e.getMessage(), 
                e);
    }

    /**
     * 记录警告日志
     */
    private void logWarn(String type, HttpServletRequest request, Exception e) {
        logger.warn("{} - URI: {}, Method: {}, IP: {}, 错误: {}", 
                type,
                request.getRequestURI(),
                request.getMethod(),
                getClientIp(request),
                e.getMessage());
    }

    /**
     * 获取客户端IP地址
     */
    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}
