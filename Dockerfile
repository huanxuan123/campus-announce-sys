FROM tomcat:9.0-jdk11

# 设置工作目录
WORKDIR /usr/local/tomcat/webapps

# 复制WAR文件到Tomcat webapps目录
COPY target/campus-announce-sys.war /usr/local/tomcat/webapps/

# 暴露8080端口
EXPOSE 8080

# 启动Tomcat
CMD ["catalina.sh", "run"]