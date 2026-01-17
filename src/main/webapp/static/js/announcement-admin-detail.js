/**
 * 管理员公告详情页面业务逻辑
 */

const AnnouncementAdminDetail = {
    announcementId: null,
    announcement: null,
    attachments: [],
    isEditing: false,
    
    init: function() {
        Logger.log('管理员公告详情页面初始化');
        
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
        const container = document.getElementById('mainContent');
        if (!container) {
            Logger.error('找不到mainContent容器');
            return;
        }
        
        const ann = this.announcement;
        const contextPath = AppConfig.apiBaseUrl.replace('/api', '') || '';
        
        const html = `
            <div class="card card-full">
                <div class="card-title">
                    <span>📝 公告编辑</span>
                    <div style="margin-left: auto; display: flex; gap: 8px;">
                        <button class="btn btn-success" onclick="AnnouncementAdminDetail.saveAnnouncement()">
                            <i class="fas fa-save"></i> 保存修改
                        </button>
                        <button class="btn btn-danger" onclick="AnnouncementAdminDetail.deleteAnnouncement()">
                            <i class="fas fa-trash"></i> 删除公告
                        </button>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">公告标题</label>
                    <input type="text" class="form-input" id="editTitle" value="${ErrorHandler.escapeHtml(ann.title || '')}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">公告类型</label>
                    <select class="form-select" id="editAnnouncementType">
                        <option value="1" ${ann.announcementType == 1 ? 'selected' : ''}>通知</option>
                        <option value="2" ${ann.announcementType == 2 ? 'selected' : ''}>活动</option>
                        <option value="3" ${ann.announcementType == 3 ? 'selected' : ''}>其他</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">公告范围</label>
                    <select class="form-select" id="editScope">
                        <option value="1" ${ann.scope == 1 ? 'selected' : ''}>全校</option>
                        <option value="2" ${ann.scope == 2 ? 'selected' : ''}>院系</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">截止时间</label>
                    <input type="datetime-local" class="form-input" id="editDeadline" value="${this.formatDateTimeLocal(ann.deadline)}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">是否置顶</label>
                    <select class="form-select" id="editIsTop">
                        <option value="0" ${ann.isTop == 0 ? 'selected' : ''}>否</option>
                        <option value="1" ${ann.isTop == 1 ? 'selected' : ''}>是</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">置顶顺序</label>
                    <input type="number" class="form-input" id="editTopOrder" value="${ann.topOrder || 0}" min="0">
                </div>
                
                <div class="form-group">
                    <label class="form-label">公告内容</label>
                    <textarea class="form-textarea" id="editContent">${ErrorHandler.escapeHtml(ann.content || '')}</textarea>
                </div>
            </div>
            
            <div class="card">
                <div class="card-title">
                    <span>📊 基本信息</span>
                </div>
                
                <div class="info-group">
                    <span class="info-label">公告ID</span>
                    <span class="info-value highlight">${ann.id}</span>
                </div>
                
                <div class="info-group">
                    <span class="info-label">发布人ID</span>
                    <span class="info-value">${ann.publisherId}</span>
                </div>
                
                <div class="info-group">
                    <span class="info-label">发布人姓名</span>
                    <span class="info-value">${ErrorHandler.escapeHtml(ann.publisherName || '系统管理员')}</span>
                </div>
                
                <div class="info-group">
                    <span class="info-label">所属院系ID</span>
                    <span class="info-value">${ann.deptId || '无'}</span>
                </div>
                
                <div class="info-group">
                    <span class="info-label">所属院系名称</span>
                    <span class="info-value">${ErrorHandler.escapeHtml(ann.deptName || '无')}</span>
                </div>
                
                <div class="info-group">
                    <span class="info-label">状态</span>
                    <span class="info-value ${ann.status == 1 ? 'highlight' : ''}">${ann.status == 1 ? '正常' : '已删除'}</span>
                </div>
            </div>
            
            <div class="card">
                <div class="card-title">
                    <span>⏰ 时间信息</span>
                </div>
                
                <div class="info-group">
                    <span class="info-label">发布时间</span>
                    <span class="info-value">${Utils.formatDate(ann.publishTime)}</span>
                </div>
                
                <div class="info-group">
                    <span class="info-label">截止时间</span>
                    <span class="info-value">${ann.deadline ? Utils.formatDate(ann.deadline) : '无'}</span>
                </div>
                
                <div class="info-group">
                    <span class="info-label">创建时间</span>
                    <span class="info-value">${Utils.formatDate(ann.createTime)}</span>
                </div>
                
                <div class="info-group">
                    <span class="info-label">更新时间</span>
                    <span class="info-value">${Utils.formatDate(ann.updateTime)}</span>
                </div>
            </div>
            
            <div class="card">
                <div class="card-title">
                    <span>📈 统计信息</span>
                </div>
                
                <div class="info-group">
                    <span class="info-label">浏览次数</span>
                    <span class="info-value highlight">${ann.viewCount || 0}</span>
                </div>
                
                <div class="info-group">
                    <span class="info-label">已读人数</span>
                    <span class="info-value highlight">${ann.readCount || 0}</span>
                </div>
                
                <div class="info-group">
                    <span class="info-label">未读人数</span>
                    <span class="info-value highlight">${ann.unreadCount || 0}</span>
                </div>
            </div>
            
            <div class="card card-full">
                <div class="card-title">
                    <span>📎 附件列表</span>
                </div>
                <div id="attachmentList">
                    <div class="loading">正在加载附件...</div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        
        document.title = ErrorHandler.escapeHtml(ann.title || '公告管理') + ' - 校园公告系统';
    },
    
    loadAttachments: function() {
        if (!this.announcementId) return;
        
        ApiClient.get('/attachment/list/' + this.announcementId)
            .then(data => {
                if (data.data && data.data.length > 0) {
                    Logger.log('附件加载成功', data.data);
                    this.attachments = data.data;
                    this.renderAttachments(data.data);
                } else {
                    Logger.log('没有附件');
                    this.renderAttachments([]);
                }
            })
            .catch(error => {
                Logger.error('加载附件失败', error);
                this.renderAttachments([]);
            });
    },
    
    renderAttachments: function(attachments) {
        const container = document.getElementById('attachmentList');
        if (!container) return;
        
        if (!attachments || attachments.length === 0) {
            container.innerHTML = `
                <div class="empty-attachments">
                    <p>暂无附件</p>
                </div>
            `;
            return;
        }
        
        const contextPath = AppConfig.apiBaseUrl.replace('/api', '') || '';
        
        const html = attachments.map(att => {
            const fileSize = this.formatFileSize(att.fileSize);
            
            return `
                <div class="attachment-item">
                    <div class="attachment-info">
                        <div class="attachment-icon">📎</div>
                        <div>
                            <div class="attachment-name">${ErrorHandler.escapeHtml(att.fileName)}</div>
                            <div class="attachment-size">${fileSize} | ID: ${att.id}</div>
                        </div>
                    </div>
                    <a href="${contextPath}/api/attachment/download/${att.id}" class="btn-download" download="${att.fileName}">
                        下载
                    </a>
                </div>
            `;
        }).join('');
        
        container.innerHTML = `<div class="attachment-list">${html}</div>`;
    },
    
    saveAnnouncement: function() {
        Logger.log('保存公告修改');
        
        const title = document.getElementById('editTitle').value.trim();
        const announcementType = parseInt(document.getElementById('editAnnouncementType').value);
        const scope = parseInt(document.getElementById('editScope').value);
        const deadline = document.getElementById('editDeadline').value;
        const isTop = parseInt(document.getElementById('editIsTop').value);
        const topOrder = parseInt(document.getElementById('editTopOrder').value);
        const content = document.getElementById('editContent').value;
        
        if (!title) {
            ErrorHandler.showError('请输入公告标题');
            return;
        }
        
        if (!content) {
            ErrorHandler.showError('请输入公告内容');
            return;
        }
        
        const updateData = {
            id: this.announcementId,
            title: title,
            announcementType: announcementType,
            scope: scope,
            isTop: isTop,
            topOrder: topOrder,
            content: content
        };
        
        if (deadline) {
            updateData.deadline = deadline;
        }
        
        ApiClient.put('/announcement/' + this.announcementId, updateData)
            .then(() => {
                ErrorHandler.showSuccess('公告修改成功');
                this.loadAnnouncementDetail();
            })
            .catch(error => {
                Logger.error('保存公告失败', error);
                ErrorHandler.showError('保存失败：' + error.message);
            });
    },
    
    deleteAnnouncement: function() {
        if (!confirm('确定要删除此公告吗？此操作不可恢复！')) {
            return;
        }
        
        Logger.log('删除公告', this.announcementId);
        
        ApiClient.delete('/announcement/' + this.announcementId)
            .then(() => {
                ErrorHandler.showSuccess('公告删除成功');
                setTimeout(() => {
                    const basePath = AppConfig.apiBaseUrl.replace('/api', '') || '';
                    window.location.href = basePath + '/announcement-list.jsp';
                }, 1500);
            })
            .catch(error => {
                Logger.error('删除公告失败', error);
                ErrorHandler.showError('删除失败：' + error.message);
            });
    },
    
    formatDateTimeLocal: function(date) {
        if (!date) return '';
        
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    },
    
    formatFileSize: function(bytes) {
        if (!bytes) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },
    
    showError: function(message) {
        const container = document.getElementById('mainContent');
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
                    <a href="${basePath}/announcement-list.jsp" class="btn btn-primary">
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
    
    AnnouncementAdminDetail.init();
});
