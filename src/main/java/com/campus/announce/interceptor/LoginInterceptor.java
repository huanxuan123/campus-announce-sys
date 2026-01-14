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
        System.out.println("LoginInterceptor - Request URI: " + requestURI);
        
        String uri = request.getRequestURI();
        
        if (uri.endsWith("/login") || uri.endsWith("/login.jsp") ||
            uri.endsWith("/register") || uri.endsWith("/register.jsp") ||
            uri.endsWith("/forgot-password") || uri.endsWith("/forgot-password.jsp") ||
            uri.endsWith("/reset-password") || uri.endsWith("/reset-password.jsp") ||
            uri.endsWith("/profile") || uri.endsWith("/profile.jsp") ||
            uri.endsWith("/user-list") || uri.endsWith("/user-list.jsp") ||
            uri.endsWith("/index") || uri.endsWith("/index.jsp") ||
            uri.startsWith("/static/") || uri.startsWith("/api/")) {
            System.out.println("LoginInterceptor - Path excluded, allowing access");
            return true;
        }
        
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        
        if (user == null) {
            System.out.println("LoginInterceptor - User not logged in, redirecting to login");
            response.sendRedirect("/login.jsp");
            return false;
        }
        
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
    }
}