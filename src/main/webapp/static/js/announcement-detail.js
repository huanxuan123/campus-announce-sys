/**
 * 公告详情页面业务逻辑
 */

const AnnouncementDetail = {
    announcementId: null,
    announcement: null,
    
    init: function() {
        Logger.log('公告详情页面初始化');
        
        const urlParams = new URLSearchParams(window.location.search);
        this.announcementId = urlParams.get('id');
        
        if (!this.announcementId) {
            this.showError('缺少公告ID参数');
            return;
        }
        
        Logger.log('公告ID', this.announcementId);
        this.loadAnnouncementDetail();
    },
    
    loadAnnouncementDetail: function() {
        ApiClient.get('/announcement/' + this.announcementId)
            .then(data => {
                if (data.data) {
                    this.announcement = data.data;
                    Logger.log('公告详情加载成功', this.announcement);
                    this.renderAnnouncement();
                    this.loadAttachments();
                } else {
                    this.showError('公告不存在');
                }
            })
            .catch(error => {
                Logger.error('加载公告详情失败', error);
                this.showError('加载公告失败：' + error.message);
            });
    },
    
    renderAnnouncement: function() {
        const container = document.getElementById('announcementContent');
        if (!container) {
            Logger.error('找不到announcementContent容器');
            return;
        }
        
        const ann = this.announcement;
        const typeLabel = this.getTypeLabel(ann.announcementType);
        const scopeLabel = this.getScopeLabel(ann.scope);
        const deptName = this.getDeptName(ann.deptCode);
        const contextPath = AppConfig.apiBaseUrl.replace('/api', '') || '';
        
        const html = `
            <div class="announcement-type type-${ann.announcementType}">
                ${typeLabel}
            </div>
            ${ann.scope === 2 && deptName ? `
            <div class="announcement-scope">${scopeLabel} · ${deptName}</div>
            ` : ''}
            
            <h2 class="announcement-title">${ErrorHandler.escapeHtml(ann.title || '无标题')}</h2>
            
            <div class="announcement-meta">
                <div class="meta-item">
                    发布人：${ErrorHandler.escapeHtml(ann.publisherName || '系统管理员')}
                </div>
                <div class="meta-item">
                    发布时间：${Utils.formatDate(ann.publishTime)}
                </div>
                <div class="meta-item">
                    浏览次数：${ann.viewCount || 0}
                </div>
            </div>
            
            <div class="announcement-body">
                ${this.formatContent(ann.content || '无内容')}
            </div>
            
            <div class="attachments" id="attachmentsSection" style="display: none;">
                <div class="attachments-title">附件</div>
                <div class="attachment-list" id="attachmentList">
                    <div class="loading">正在加载附件...</div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        
        document.title = ErrorHandler.escapeHtml(ann.title || '公告详情') + ' - 校园公告系统';
    },
    
    loadAttachments: function() {
        if (!this.announcementId) return;
        
        ApiClient.get('/attachment/list/' + this.announcementId)
            .then(data => {
                if (data.data && data.data.length > 0) {
                    Logger.log('附件加载成功', data.data);
                    this.renderAttachments(data.data);
                } else {
                    Logger.log('没有附件');
                }
            })
            .catch(error => {
                Logger.error('加载附件失败', error);
            });
    },
    
    renderAttachments: function(attachments) {
        const container = document.getElementById('attachmentsSection');
        const listContainer = document.getElementById('attachmentList');
        
        if (!container || !listContainer) return;
        
        container.style.display = 'block';
        
        const html = attachments.map(att => {
            const fileSize = this.formatFileSize(att.fileSize);
            const contextPath = AppConfig.apiBaseUrl.replace('/api', '') || '';
            
            return `
                <div class="attachment-item">
                    <div class="attachment-info">
                        <div class="attachment-icon">📎</div>
                        <div>
                            <div class="attachment-name">${ErrorHandler.escapeHtml(att.fileName)}</div>
                            <div class="attachment-size">${fileSize}</div>
                        </div>
                    </div>
                    <a href="${contextPath}/api/attachment/download/${att.id}" class="btn-download" download="${att.fileName}">
                        下载
                    </a>
                </div>
            `;
        }).join('');
        
        listContainer.innerHTML = html;
    },
    
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
    
    formatContent: function(content) {
        if (!content) return '';
        
        content = ErrorHandler.escapeHtml(content);
        content = content.replace(/\n/g, '<br>');
        return content;
    },
    
    formatFileSize: function(bytes) {
        if (!bytes) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },
    
    showError: function(message) {
        const container = document.getElementById('announcementContent');
        if (!container) {
            ErrorHandler.showError(message);
            return;
        }
        
        const basePath = AppConfig.apiBaseUrl.replace('/api', '') || '';
        
        container.innerHTML = `
            <div class="error">
                <div class="error-icon">❌</div>
                <h3>加载失败</h3>
                <p>${ErrorHandler.escapeHtml(message)}</p>
                <div style="margin-top: 20px;">
                    <a href="${basePath}/announcement-list.jsp" class="btn btn-primary" style="margin-right: 10px;">
                        返回列表
                    </a>
                </div>
            </div>
        `;
    }
};

document.addEventListener('DOMContentLoaded', function() {
    if (typeof contextPath !== 'undefined' && contextPath) {
        AppConfig.apiBaseUrl = contextPath + '/api';
    } else {
        AppConfig.apiBaseUrl = '/api';
        Logger.warn('未找到contextPath，使用默认值 /api');
    }
    
    Logger.log('API基础URL已设置', AppConfig.apiBaseUrl);
    
    AnnouncementDetail.init();
});
