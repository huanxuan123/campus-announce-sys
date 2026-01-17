# 开发任务清单

## 人员1 - 用户模块

### 任务列表

#### 高优先级
- [ ] 实现用户登录功能
  - [ ] 创建LoginController
  - [ ] 创建UserService
  - [ ] 实现登录验证逻辑
  - [ ] 创建登录页面（login.jsp）
  - [ ] 密码加密（使用BCrypt）

- [ ] 实现用户信息管理
  - [ ] 创建UserController
  - [ ] 实现用户信息查询
  - [ ] 实现用户信息修改
  - [ ] 实现密码修改功能
  - [ ] 创建用户管理页面

- [ ] 实现院系管理员管理（超级管理员功能）
  - [ ] 创建院系管理员账号
  - [ ] 删除院系管理员账号
  - [ ] 查询院系管理员列表
  - [ ] 创建院系管理员管理页面

#### 中优先级
- [ ] 实现密码找回功能
  - [ ] 创建邮件发送服务
  - [ ] 实现密码重置链接生成
  - [ ] 实现密码重置功能
  - [ ] 创建密码找回页面

- [ ] 实现系统参数配置
  - [ ] 创建ConfigController
  - [ ] 实现参数查询
  - [ ] 实现参数修改
  - [ ] 创建系统参数配置页面

#### 低优先级
- [ ] 实现用户权限验证
  - [ ] 创建权限拦截器
  - [ ] 实现角色权限判断
  - [ ] 页面权限控制

### 涉及文件
- Controller: `com.campus.announce.controller.user.*`
- Service: `com.campus.announce.service.user.*`
- Mapper: `com.campus.announce.mapper.user.UserMapper`（已创建）
- JSP: `src/main/webapp/WEB-INF/views/user/*`
- Entity: `com.campus.announce.entity.User`（已创建）

---

## 人员2 - 公告发布模块

### 任务列表

#### 高优先级
- [ ] 实现公告发布功能
  - [ ] 创建AnnouncementPublishController
  - [ ] 创建AnnouncementPublishService
  - [ ] 实现全校公告发布
  - [ ] 实现院系公告发布
  - [ ] 创建公告发布页面（publish.jsp）
  - [ ] 实现公告类型选择（通知/活动/其他）

- [ ] 实现公告修改功能
  - [ ] 创建公告编辑页面（edit.jsp）
  - [ ] 实现公告信息查询
  - [ ] 实现公告信息更新
  - [ ] 验证截止时间限制

- [ ] 实现公告删除功能
  - [ ] 实现逻辑删除（status=0）
  - [ ] 添加删除确认
  - [ ] 实现批量删除

#### 中优先级
- [ ] 实现公告置顶功能
  - [ ] 实现置顶/取消置顶
  - [ ] 实现置顶顺序调整
  - [ ] 验证置顶数量限制
  - [ ] 创建置顶管理页面

- [ ] 实现附件上传功能
  - [ ] 创建AttachmentController
  - [ ] 创建AttachmentService
  - [ ] 实现文件上传
  - [ ] 实现文件类型验证
  - [ ] 实现文件大小限制
  - [ ] 实现附件下载
  - [ ] 实现附件删除

#### 低优先级
- [ ] 实现公告草稿功能
  - [ ] 保存草稿
  - [ ] 编辑草稿
  - [ ] 发布草稿

### 涉及文件
- Controller: `com.campus.announce.controller.announcement.*`
- Service: `com.campus.announce.service.announcement.*`
- Mapper: `com.campus.announce.mapper.announcement.AnnouncementMapper`（已创建）
- JSP: `src/main/webapp/WEB-INF/views/announcement/*`
- Entity: `com.campus.announce.entity.Announcement`（已创建）
- Entity: `com.campus.announce.entity.Attachment`（已创建）

---

## 人员3 - 公告查询模块

### 任务列表

#### 高优先级
- [ ] 实现公告列表展示
  - [ ] 创建AnnouncementQueryController
  - [ ] 创建AnnouncementQueryService
  - [ ] 实现全校公告列表
  - [ ] 实现院系公告列表
  - [ ] 创建公告列表页面（list.jsp）
  - [ ] 实现分页功能

- [ ] 实现多条件查询
  - [ ] 按标题模糊查询
  - [ ] 按公告类型查询
  - [ ] 按院系查询
  - [ ] 按发布时间范围查询
  - [ ] 创建查询页面（search.jsp）

- [ ] 实现公告详情查看
  - [ ] 创建公告详情页面（detail.jsp）
  - [ ] 实现公告内容展示
  - [ ] 实现附件展示
  - [ ] 增加浏览次数

#### 中优先级
- [ ] 实现未读公告提示
  - [ ] 查询未读公告数量
  - [ ] 在首页显示未读提示
  - [ ] 创建未读公告列表
  - [ ] 标记已读功能

- [ ] 实现公告排序
  - [ ] 按发布时间排序（最新/最早）
  - [ ] 按浏览次数排序
  - [ ] 置顶公告优先显示

#### 低优先级
- [ ] 实现公告搜索历史
  - [ ] 保存搜索记录
  - [ ] 显示搜索历史
  - [ ] 清除搜索历史

- [ ] 实现公告收藏功能
  - [ ] 收藏公告
  - [ ] 取消收藏
  - [ ] 查看收藏列表

### 涉及文件
- Controller: `com.campus.announce.controller.query.*`
- Service: `com.campus.announce.service.query.*`
- Mapper: `com.campus.announce.mapper.query.AnnouncementReadMapper`（已创建）
- JSP: `src/main/webapp/WEB-INF/views/query/*`
- Entity: `com.campus.announce.entity.Announcement`（已创建）

---

## 人员4 - 公告统计模块

### 任务列表

#### 高优先级
- [ ] 实现按类型统计
  - [ ] 创建StatisticsController
  - [ ] 创建StatisticsService
  - [ ] 统计全校公告类型分布
  - [ ] 统计院系公告类型分布
  - [ ] 创建统计页面（statistics.jsp）
  - [ ] 使用图表展示（ECharts）

- [ ] 实现按院系统计
  - [ ] 统计各院系公告数量
  - [ ] 统计各院系公告类型分布
  - [ ] 创建院系统计页面

- [ ] 实现按时间段统计
  - [ ] 统计日公告发布量
  - [ ] 统计周公告发布量
  - [ ] 统计月公告发布量
  - [ ] 创建时间统计页面

#### 中优先级
- [ ] 实现已读/未读统计
  - [ ] 统计每条公告已读人数
  - [ ] 统计每条公告未读人数
  - [ ] 统计用户未读公告数量
  - [ ] 创建阅读统计页面

- [ ] 实现综合统计
  - [ ] 公告总数统计
  - [ ] 置顶公告统计
  - [ ] 浏览量统计
  - [ ] 创建综合统计页面

#### 低优先级
- [ ] 实现统计报表导出
  - [ ] 导出Excel报表
  - [ ] 导出PDF报表
  - [ ] 自定义报表

- [ ] 实现数据可视化
  - [ ] 饼图展示
  - [ ] 柱状图展示
  - [ ] 折线图展示
  - [ ] 仪表盘展示

### 涉及文件
- Controller: `com.campus.announce.controller.statistics.*`
- Service: `com.campus.announce.service.statistics.*`
- Mapper: `com.campus.announce.mapper.statistics.StatisticsMapper`（已创建）
- JSP: `src/main/webapp/WEB-INF/views/statistics/*`
- Entity: `com.campus.announce.entity.Announcement`（已创建）

---

## 公共任务（所有人员协作）

### 前端页面开发
- [ ] 创建首页（index.jsp）
- [ ] 创建导航栏
- [ ] 创建侧边栏
- [ ] 统一页面样式（CSS）
- [ ] 统一JavaScript工具函数

### 测试
- [ ] 编写单元测试
- [ ] 编写集成测试
- [ ] 进行功能测试
- [ ] 进行性能测试

### 文档
- [ ] API接口文档
- [ ] 用户使用手册
- [ ] 部署文档
- [ ] 维护文档

---

## 开发进度跟踪

### 人员1 - 用户模块
- [ ] 阶段1：用户登录（预计2天）
- [ ] 阶段2：用户信息管理（预计2天）
- [ ] 阶段3：院系管理员管理（预计1天）
- [ ] 阶段4：密码找回（预计1天）
- [ ] 阶段5：系统参数配置（预计1天）
- [ ] 阶段6：权限验证（预计1天）

### 人员2 - 公告发布模块
- [ ] 阶段1：公告发布（预计2天）
- [ ] 阶段2：公告修改（预计1天）
- [ ] 阶段3：公告删除（预计1天）
- [ ] 阶段4：公告置顶（预计1天）
- [ ] 阶段5：附件上传（预计2天）
- [ ] 阶段6：公告草稿（预计1天）

### 人员3 - 公告查询模块
- [ ] 阶段1：公告列表（预计2天）
- [ ] 阶段2：多条件查询（预计2天）
- [ ] 阶段3：公告详情（预计1天）
- [ ] 阶段4：未读提示（预计1天）
- [ ] 阶段5：公告排序（预计1天）
- [ ] 阶段6：搜索历史（预计1天）

### 人员4 - 公告统计模块
- [ ] 阶段1：按类型统计（预计2天）
- [ ] 阶段2：按院系统计（预计1天）
- [ ] 阶段3：按时间段统计（预计2天）
- [ ] 阶段4：已读/未读统计（预计1天）
- [ ] 阶段5：综合统计（预计1天）
- [ ] 阶段6：报表导出（预计1天）

---

## 里程碑

- [ ] **里程碑1**：完成所有Controller和Service层（预计第1周）
- [ ] **里程碑2**：完成所有JSP页面开发（预计第2周）
- [ ] **里程碑3**：完成功能测试和bug修复（预计第3周）
- [ ] **里程碑4**：完成文档编写和部署（预计第4周）

---

## 注意事项

1. **代码规范**：遵循Java命名规范，添加必要的注释
2. **提交规范**：使用规范的commit message格式
3. **测试要求**：每个功能完成后进行自测
4. **文档更新**：修改功能时同步更新文档
5. **及时沟通**：遇到问题及时在团队中讨论
6. **定期同步**：每天开始工作前先拉取最新代码

---

## 问题反馈

如遇到问题，请在GitHub上创建Issue，并@相关负责人。