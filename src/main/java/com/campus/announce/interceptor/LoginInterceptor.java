package com.campus.announce.interceptor;

import com.campus.announce.entity.User;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class LoginInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String requestURI = request.getRequestURI();
        String contextPath = request.getContextPath();
        String path = requestURI.substring(contextPath.length());
        
        System.out.println("=== LoginInterceptor Debug ===");
        System.out.println("Request URI: " + requestURI);
        System.out.println("Context Path: " + contextPath);
        System.out.println("Relative Path: " + path);
        System.out.println("Starts with /static/: " + path.startsWith("/static/"));
        System.out.println("Starts with /api/: " + path.startsWith("/api/"));
        
        if (path.endsWith("/login") || path.endsWith("/login.jsp") ||
            path.endsWith("/register") || path.endsWith("/register.jsp") ||
            path.endsWith("/forgot-password") || path.endsWith("/forgot-password.jsp") ||
            path.endsWith("/reset-password") || path.endsWith("/reset-password.jsp") ||
            path.endsWith("/profile") || path.endsWith("/profile.jsp") ||
            path.endsWith("/user-list") || path.endsWith("/user-list.jsp") ||
            path.endsWith("/index") || path.endsWith("/index.jsp") ||
            path.startsWith("/static/") || path.startsWith("/api/")) {
            System.out.println("✓ Path excluded, allowing access");
            return true;
        }
        
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        
        if (user == null) {
            System.out.println("✗ User not logged in, redirecting to login");
            response.sendRedirect(contextPath + "/login.jsp");
            return false;
        }
        
        System.out.println("✓ User logged in, allowing access");
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
    }
}