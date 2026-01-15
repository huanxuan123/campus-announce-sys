/**
 * 公告列表页面业务逻辑
 * 完全分离业务逻辑，JSP只负责页面结构
 */

// 公告列表管理
const AnnouncementList = {
    // 当前公告列表
    currentAnnouncements: [],
    
    // 当前用户信息
    currentUser: null,
    
    // 加载状态
    isLoading: false,
    
    // 当前筛选类型
    currentFilterType: '',
    
    // 系统配置
    systemConfigs: {
        retentionDays: '',
        maxTopAnnouncements: '',
        maxAttachmentSize: '',
        allowedFileTypes: ''
    },
    
    /**
     * 初始化
     */
    init: function() {
        Logger.log('公告列表页面初始化');
        this.loadUserInfo();
        this.bindEvents();
        this.loadAnnouncements();
    },
    
    /**
     * 加载用户信息
     */
    loadUserInfo: function() {
        ApiClient.get('/currentUser')
            .then(data => {
                if (data.data) {
                    this.currentUser = data.data;
                    this.updateUserDisplay();
                    this.updateSystemSettingsButton();
                } else {
                    this.currentUser = null;
                    document.getElementById('userName').textContent = '未登录';
                    this.updateSystemSettingsButton();
                }
            })
            .catch(error => {
                Logger.error('加载用户信息失败', error);
                document.getElementById('userName').textContent = '未登录';
                this.updateSystemSettingsButton();
            });
    },
    
    /**
     * 更新系统设置按钮显示状态
     */
    updateSystemSettingsButton: function() {
        const settingsBtn = document.querySelector('.btn-system-settings');
        if (settingsBtn) {
            if (this.currentUser && this.currentUser.userType === 1) {
                settingsBtn.style.display = 'flex';
            } else {
                settingsBtn.style.display = 'none';
            }
        }
    },
    
    /**
     * 更新用户显示
     */
    updateUserDisplay: function() {
        const userNameEl = document.getElementById('userName');
        if (userNameEl && this.currentUser) {
            userNameEl.textContent = this.currentUser.realName || '用户';
        }
    },
    
    /**
     * 加载公告列表
     */
    loadAnnouncements: function() {
        if (this.isLoading) {
            Logger.log('正在加载中，跳过重复请求');
            return;
        }
        
        this.isLoading = true;
        Logger.log('开始加载公告列表');
        
        const params = {
        };
        
        ApiClient.get('/announcement/list', params)
            .then(data => {
                if (data.data && Array.isArray(data.data)) {
                    this.currentAnnouncements = data.data;
                    Logger.log('公告列表加载成功', { count: this.currentAnnouncements.length });
                    this.renderAnnouncements(this.currentAnnouncements);
                } else {
                    Logger.warn('API返回的数据格式不正确', data);
                    this.currentAnnouncements = [];
                    this.renderAnnouncements([]);
                }
            })
            .catch(error => {
                Logger.error('加载公告列表失败', error);
                this.showError('加载公告失败：' + error.message);
            })
            .finally(() => {
                this.isLoading = false;
            });
    },
    
    /**
     * 渲染公告列表
     */
    renderAnnouncements: function(announcements) {
        const container = document.getElementById('announcementsList');
        if (!container) {
            Logger.error('找不到announcementsList容器');
            return;
        }
        
        if (!announcements || announcements.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>暂无公告</h3>
                    <p>当前还没有公告内容，敬请期待</p>
                </div>
            `;
            return;
        }
        
        try {
            const html = announcements.map(ann => this.createAnnouncementCard(ann)).join('');
            container.innerHTML = html;
            Logger.log('公告列表渲染完成', { count: announcements.length });
        } catch (err) {
            Logger.error('渲染公告列表失败', err);
            this.showError('渲染公告失败：' + err.message);
        }
    },
    
    /**
     * 创建单个公告卡片HTML
     */
    createAnnouncementCard: function(ann) {
        const isTop = ann.isTop == 1;
        const announcementType = ann.announcementType || 1;
        const typeLabel = this.getTypeLabel(announcementType);
        const title = ErrorHandler.escapeHtml(ann.title || '无标题');
        const content = ann.content ? ErrorHandler.escapeHtml(ann.content.substring(0, 120)) + '...' : '(无内容)';
        const publisherName = ErrorHandler.escapeHtml(ann.publisherName || '系统管理员');
        const viewCount = ann.viewCount || 0;
        const publishTime = Utils.formatDate(ann.publishTime);
        const announcementId = ann.id;
        const contextPath = AppConfig.apiBaseUrl.replace('/api', '') || '';
        
        const scope = ann.scope || 1;
        const scopeLabel = this.getScopeLabel(scope);
        const deptName = this.getDeptName(ann.deptCode);
        
        let adminButton = '';
        if (this.currentUser) {
            if (this.currentUser.userType === 1) {
                adminButton = '<a href="' + contextPath + '/announcement-admin-detail.jsp?id=' + announcementId + '" class="btn btn-sm" style="background: #8b5cf6; color: white;">' +
                        '<i class="fas fa-cog"></i> 管理员详情' +
                        '</a>';
            } else if (this.currentUser.userType === 2) {
                if (ann.scope === 2 && ann.deptId === this.currentUser.deptId) {
                    adminButton = '<a href="' + contextPath + '/announcement-admin-detail.jsp?id=' + announcementId + '" class="btn btn-sm" style="background: #8b5cf6; color: white;">' +
                            '<i class="fas fa-cog"></i> 管理员详情' +
                            '</a>';
                }
            }
        }
        
        return '<div class="announcement-card' + (isTop ? ' is-top' : '') + '">' +
            '<div class="announcement-header">' +
            '<span class="announcement-type type-' + announcementType + '">' +
            ErrorHandler.escapeHtml(typeLabel) +
            '</span>' +
            '<span class="announcement-scope">' + ErrorHandler.escapeHtml(scopeLabel) + (deptName ? ' · ' + deptName : '') + '</span>' +
            '</div>' +
            '<h3 class="announcement-title">' +
            '<a href="' + contextPath + '/announcement-detail.jsp?id=' + announcementId + '">' +
            title +
            '</a>' +
            '</h3>' +
            '<div class="announcement-meta">' +
            '<span class="meta-item">' +
            '<i class="fas fa-user"></i> ' + publisherName +
            '</span>' +
            '<span class="meta-item">' +
            '<i class="fas fa-calendar"></i> ' + publishTime +
            '</span>' +
            '<span class="meta-item">' +
            '<i class="fas fa-eye"></i> ' + viewCount + ' 浏览' +
            '</span>' +
            '</div>' +
            '<div class="announcement-content">' +
            content +
            '</div>' +
            '<div class="announcement-footer">' +
            '<a href="' + contextPath + '/announcement-detail.jsp?id=' + announcementId + '" class="btn btn-sm" style="background: var(--primary); color: white;">' +
            '<i class="fas fa-eye"></i> 查看详情' +
            '</a>' +
            adminButton +
            '</div>' +
            '</div>';
    },
    
    /**
     * 获取类型标签
     */
    getTypeLabel: function(type) {
        switch(type) {
            case 1: return '📢 通知';
            case 2: return '🎉 活动';
            case 3: return '📌 其他';
            default: return '📰 公告';
        }
    },
    
    getScopeLabel: function(scope) {
        switch(scope) {
            case 1: return '🌐 全校';
            case 2: return '🏫 院系';
            default: return '📰 公告';
        }
    },
    
    getDeptName: function(deptCode) {
        if (!deptCode) return '';
        
        const deptMap = {
            'CS': '计算机学院',
            'SE': '软件学院',
            'IE': '信息工程学院',
            'EE': '电子工程学院',
            'ME': '机械工程学院'
        };
        
        return deptMap[deptCode] || deptCode;
    },
    
    /**
     * 搜索公告
     */
    searchAnnouncements: function() {
        const keyword = document.getElementById('searchKeyword')?.value.toLowerCase() || '';
        const type = document.getElementById('typeFilter')?.value || '';
        
        let filtered = this.currentAnnouncements;
        
        if (keyword) {
            filtered = filtered.filter(ann => 
                (ann.title && ann.title.toLowerCase().includes(keyword)) || 
                (ann.content && ann.content.toLowerCase().includes(keyword))
            );
        }
        
        if (type) {
            filtered = filtered.filter(ann => ann.announcementType == type);
        }
        
        this.renderAnnouncements(filtered);
    },
    
    /**
     * 按类型筛选公告（左侧筛选按钮）
     */
    filterByType: function(type) {
        Logger.log('按类型筛选', { type });
        this.currentFilterType = type;
        
        // 更新下拉框的值
        const typeFilter = document.getElementById('typeFilter');
        if (typeFilter) {
            typeFilter.value = type;
        }
        
        // 更新左侧筛选按钮的激活状态
        this.updateFilterButtons(type);
        
        // 执行筛选
        const keyword = document.getElementById('searchKeyword')?.value.toLowerCase() || '';
        let filtered = this.currentAnnouncements;
        
        if (keyword) {
            filtered = filtered.filter(ann => 
                (ann.title && ann.title.toLowerCase().includes(keyword)) || 
                (ann.content && ann.content.toLowerCase().includes(keyword))
            );
        }
        
        if (type) {
            filtered = filtered.filter(ann => ann.announcementType == type);
        }
        
        this.renderAnnouncements(filtered);
    },
    
    /**
     * 更新左侧筛选按钮的激活状态
     */
    updateFilterButtons: function(activeType) {
        const filterOptions = document.querySelectorAll('.filter-option');
        filterOptions.forEach((option, index) => {
            const typeMap = { 0: '', 1: '1', 2: '2', 3: '3' };
            const optionType = typeMap[index];
            
            if (optionType === activeType) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    },
    
    /**
     * 绑定事件
     */
    bindEvents: function() {
        const searchBtn = document.querySelector('.btn-search');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.searchAnnouncements());
        }
        
        const searchInput = document.getElementById('searchKeyword');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchAnnouncements();
                }
            });
            
            searchInput.addEventListener('input', Utils.debounce(() => {
                this.searchAnnouncements();
            }, 500));
        }
        
        const typeFilter = document.getElementById('typeFilter');
        if (typeFilter) {
            typeFilter.addEventListener('change', () => {
                this.currentFilterType = typeFilter.value;
                this.updateFilterButtons(typeFilter.value);
                this.searchAnnouncements();
            });
        }
        
        // 绑定左侧筛选按钮的点击事件
        const filterOptions = document.querySelectorAll('.filter-option');
        filterOptions.forEach((option, index) => {
            option.addEventListener('click', () => {
                const typeMap = { 0: '', 1: '1', 2: '2', 3: '3' };
                const type = typeMap[index];
                this.filterByType(type);
            });
        });
    },
    
    /**
     * 显示错误
     */
    showError: function(message) {
        const container = document.getElementById('announcementsList');
        if (!container) {
            ErrorHandler.showError(message);
            return;
        }
        
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-circle" style="color: var(--danger);"></i>
                <h3>加载失败</h3>
                <p style="text-align: left; max-width: 600px; margin: 0 auto;">' + ErrorHandler.escapeHtml(message) + '</p>
                <div style="margin-top: 20px;">
                    <button class="btn btn-primary" onclick="AnnouncementList.loadAnnouncements()" style="margin-right: 10px;">
                        <i class="fas fa-redo"></i> 重新加载
                    </button>
                    <a href="' + (AppConfig.apiBaseUrl.replace('/api', '') || '') + '/login.jsp" class="btn btn-secondary">
                        <i class="fas fa-sign-in-alt"></i> 去登录
                    </a>
                </div>
            </div>
        `;
    },
    
    /**
     * 退出登录
     */
    logout: function() {
        if (confirm('确定要退出登录吗？')) {
            ApiClient.post('/logout')
                .then(() => {
                    ErrorHandler.showSuccess('退出成功');
                    setTimeout(() => {
                        const basePath = AppConfig.apiBaseUrl.replace('/api', '') || '';
                        window.location.href = basePath + '/login.jsp';
                    }, 1000);
                })
                .catch(error => {
                    Logger.error('退出登录失败', error);
                    ErrorHandler.showError('退出失败：' + error.message);
                });
        }
    },
    
    /**
     * 显示系统参数设置模态框
     */
    showSystemSettings: function() {
        Logger.log('显示系统参数设置');
        
        if (this.currentUser && this.currentUser.userType !== 1) {
            ErrorHandler.showError('只有超级管理员可以修改系统参数');
            return;
        }
        
        this.loadSystemConfigs();
        
        const modal = document.getElementById('systemSettingsModal');
        if (modal) {
            modal.classList.add('show');
        }
    },
    
    /**
     * 关闭系统参数设置模态框
     */
    closeSystemSettings: function() {
        Logger.log('关闭系统参数设置');
        const modal = document.getElementById('systemSettingsModal');
        if (modal) {
            modal.classList.remove('show');
        }
    },
    
    /**
     * 加载系统参数
     */
    loadSystemConfigs: function() {
        Logger.log('加载系统参数');
        
        Promise.all([
            ApiClient.get('/config/announcementRetentionDays'),
            ApiClient.get('/config/maxTopAnnouncements'),
            ApiClient.get('/config/maxAttachmentSize'),
            ApiClient.get('/config/allowedFileTypes')
        ])
        .then(([retentionDays, maxTop, maxSize, fileTypes]) => {
            if (retentionDays.data) {
                document.getElementById('retentionDays').value = retentionDays.data;
            }
            if (maxTop.data) {
                document.getElementById('maxTopAnnouncements').value = maxTop.data;
            }
            if (maxSize.data) {
                document.getElementById('maxAttachmentSize').value = maxSize.data;
            }
            if (fileTypes.data) {
                document.getElementById('allowedFileTypes').value = fileTypes.data;
            }
            Logger.log('系统参数加载完成', {
                retentionDays: retentionDays.data,
                maxTop: maxTop.data,
                maxSize: maxSize.data,
                fileTypes: fileTypes.data
            });
        })
        .catch(error => {
            Logger.error('加载系统参数失败', error);
            ErrorHandler.showError('加载系统参数失败：' + error.message);
        });
    },
    
    /**
     * 保存系统参数
     */
    saveSystemSettings: function() {
        Logger.log('保存系统参数');
        
        if (this.currentUser && this.currentUser.userType !== 1) {
            ErrorHandler.showError('只有超级管理员可以修改系统参数');
            return;
        }
        
        const retentionDays = document.getElementById('retentionDays').value.trim();
        const maxTop = document.getElementById('maxTopAnnouncements').value.trim();
        const maxSize = document.getElementById('maxAttachmentSize').value.trim();
        const fileTypes = document.getElementById('allowedFileTypes').value.trim();
        
        const params = {
            configValue: retentionDays
        };
        
        Promise.all([
            ApiClient.put('/config/system/announcementRetentionDays', params),
            ApiClient.put('/config/system/maxTopAnnouncements', { configValue: maxTop }),
            ApiClient.put('/config/system/maxAttachmentSize', { configValue: maxSize }),
            ApiClient.put('/config/system/allowedFileTypes', { configValue: fileTypes })
        ])
        .then(() => {
            ErrorHandler.showSuccess('系统参数保存成功');
            this.closeSystemSettings();
            this.loadAnnouncements();
        })
        .catch(error => {
            Logger.error('保存系统参数失败', error);
            ErrorHandler.showError('保存系统参数失败：' + error.message);
        });
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 设置API基础URL
    if (typeof contextPath !== 'undefined' && contextPath) {
        AppConfig.apiBaseUrl = contextPath + '/api';
    } else {
        // 如果contextPath未定义，尝试从页面获取
        const scripts = document.getElementsByTagName('script');
        for (let script of scripts) {
            if (script.textContent && script.textContent.includes('contextPath')) {
                const match = script.textContent.match(/contextPath\s*=\s*['"]([^'"]+)['"]/);
                if (match) {
                    AppConfig.apiBaseUrl = match[1] + '/api';
                    break;
                }
            }
        }
        // 如果还是找不到，使用默认值
        if (!AppConfig.apiBaseUrl) {
            AppConfig.apiBaseUrl = '/api';
            Logger.warn('未找到contextPath，使用默认值 /api');
        }
    }
    
    Logger.log('API基础URL已设置', AppConfig.apiBaseUrl);
    
    // 初始化公告列表
    AnnouncementList.init();
});
