package com.campus.announce.interceptor;

import com.campus.announce.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * 登录拦截器
 * 检查用户是否已登录，未登录用户重定向到登录页面
 */
public class LoginInterceptor implements HandlerInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(LoginInterceptor.class);

    @Override
    public boolean preHandle(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull Object handler) throws Exception {
        String requestURI = request.getRequestURI();
        String contextPath = request.getContextPath();
        String path = requestURI.substring(contextPath.length());
        
        logger.debug("拦截请求 - URI: {}, Path: {}", requestURI, path);
        
        // 排除不需要登录的路径
        if (isPublicPath(path)) {
            logger.debug("公开路径，允许访问: {}", path);
            return true;
        }
        
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        
        if (user == null) {
            logger.warn("未登录用户尝试访问受保护资源: {}, IP: {}", path, getClientIp(request));
            response.sendRedirect(contextPath + "/login.jsp");
            return false;
        }
        
        logger.debug("已登录用户访问: {}, 用户: {}", path, user.getUsername());
        return true;
    }
    
    /**
     * 判断是否为公开路径（不需要登录）
     */
    private boolean isPublicPath(String path) {
        // 去除查询参数
        int queryIndex = path.indexOf('?');
        if (queryIndex > 0) {
            path = path.substring(0, queryIndex);
        }
        
        // 静态资源
        if (path.startsWith("/static/") || path.startsWith("/uploads/") || path.startsWith("/api/")) {
            return true;
        }
        
        // 公开页面
        if (path.endsWith("/login") || path.endsWith("/login.jsp") ||
            path.endsWith("/register") || path.endsWith("/register.jsp") ||
            path.endsWith("/forgot-password") || path.endsWith("/forgot-password.jsp") ||
            path.endsWith("/reset-password") || path.endsWith("/reset-password.jsp") ||
            path.endsWith("/announcement-list") || path.endsWith("/announcement-list.jsp") ||
            path.endsWith("/announcement") || path.endsWith("/announcement-detail.jsp") ||
            path.endsWith("/index") || path.endsWith("/index.jsp") ||
            path.endsWith("/diagnostics.jsp") ||
            path.equals("/") || path.isEmpty() ||
            path.equals("/favicon.ico")) {
            return true;
        }
        
        return false;
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

    @Override
    public void postHandle(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull Object handler, @Nullable ModelAndView modelAndView) throws Exception {
    }

    @Override
    public void afterCompletion(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull Object handler, @Nullable Exception ex) throws Exception {
    }
}