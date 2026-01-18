/**
 * 管理员公告详情页面业务逻辑
 */

const AnnouncementAdminDetail = {
    announcementId: null,
    announcement: null,
    attachments: [],
    isEditing: false,
    departments: [],
    
    init: function() {
        Logger.log('管理员公告详情页面初始化');
        
        // 加载院系列表
        this.loadDepartments();
        
        const urlParams = new URLSearchParams(window.location.search);
        this.announcementId = urlParams.get('id');
        
        if (this.announcementId) {
            // 编辑现有公告模式
            Logger.log('公告ID', this.announcementId);
            this.loadAnnouncementDetail();
        } else {
            // 创建新公告模式
            this.isEditing = true;
        }
    },
    
    /**
     * 加载院系列表
     */
    loadDepartments: function() {
        Logger.log('开始加载院系列表');
        
        ApiClient.get('/department/list')
            .then(data => {
                if (data.data && Array.isArray(data.data)) {
                    this.departments = data.data;
                    Logger.log('院系列表加载成功', { count: this.departments.length });
                    
                    // 如果是创建新公告模式，渲染表单
                    if (!this.announcementId && this.isEditing) {
                        this.renderPublishForm();
                    }
                } else {
                    Logger.warn('API返回的数据格式不正确', data);
                    this.departments = [];
                    
                    // 如果是创建新公告模式，渲染表单
                    if (!this.announcementId && this.isEditing) {
                        this.renderPublishForm();
                    }
                }
            })
            .catch(error => {
                Logger.error('加载院系列表失败', error);
                this.departments = [];
                
                // 如果是创建新公告模式，渲染表单
                if (!this.announcementId && this.isEditing) {
                    this.renderPublishForm();
                }
            });
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
                    <select class="form-select" id="editScope" onchange="AnnouncementAdminDetail.toggleDepartmentSelect()">
                        <option value="1" ${ann.scope == 1 ? 'selected' : ''}>全校</option>
                        <option value="2" ${ann.scope == 2 ? 'selected' : ''}>院系</option>
                    </select>
                </div>
                
                <div class="form-group" id="departmentSelectGroup" ${ann.scope == 2 ? '' : 'style="display: none;"'}>
                    <label class="form-label">所属院系</label>
                    <select class="form-select" id="editDeptId">
                        ${this.departments.map(dept => `
                        <option value="${dept.id}" ${ann.deptId == dept.id ? 'selected' : ''}>${ErrorHandler.escapeHtml(dept.deptName)}</option>
                        `).join('')}
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
    
    /**
     * 切换院系选择框显示状态
     */
    toggleDepartmentSelect: function() {
        const scope = document.getElementById('editScope').value;
        const departmentSelectGroup = document.getElementById('departmentSelectGroup');
        const deptSelect = document.getElementById('editDeptId');
        
        if (scope == '2') {
            departmentSelectGroup.style.display = 'block';
            deptSelect.setAttribute('required', 'required');
        } else {
            departmentSelectGroup.style.display = 'none';
            deptSelect.removeAttribute('required');
        }
    },
    
    saveAnnouncement: function() {
        Logger.log(this.announcementId ? '保存公告修改' : '发布新公告');
        
        const title = document.getElementById('editTitle').value.trim();
        const announcementType = parseInt(document.getElementById('editAnnouncementType').value);
        const scope = parseInt(document.getElementById('editScope').value);
        const deptId = document.getElementById('editDeptId')?.value;
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
        
        if (scope == 2 && !deptId) {
            ErrorHandler.showError('请选择所属院系');
            return;
        }
        
        const announcementData = {
            title: title,
            announcementType: announcementType,
            scope: scope,
            isTop: isTop,
            topOrder: topOrder,
            content: content
        };
        
        if (deptId) {
            announcementData.deptId = parseInt(deptId);
        }
        
        if (deadline) {
            announcementData.deadline = deadline;
        }
        
        let apiPromise;
        if (this.announcementId) {
            // 编辑现有公告
            apiPromise = ApiClient.put('/announcement/' + this.announcementId, announcementData);
        } else {
            // 创建新公告
            apiPromise = ApiClient.post('/announcement', announcementData);
        }
        
        apiPromise.then(() => {
            const successMsg = this.announcementId ? '公告修改成功' : '公告发布成功';
            ErrorHandler.showSuccess(successMsg);
            
            if (this.announcementId) {
                // 编辑模式：重新加载详情
                this.loadAnnouncementDetail();
            } else {
                // 创建模式：跳转到公告列表
                const basePath = AppConfig.apiBaseUrl.replace('/api', '') || '';
                window.location.href = basePath + '/announcement-list.jsp';
            }
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
    
    /**
     * 渲染发布新公告表单
     */
    renderPublishForm: function() {
        const container = document.getElementById('mainContent');
        if (!container) {
            Logger.error('找不到mainContent容器');
            return;
        }
        
        const html = `
            <div class="card card-full">
                <div class="card-title">
                    <span>📝 发布新公告</span>
                    <div style="margin-left: auto; display: flex; gap: 8px;">
                        <button class="btn btn-success" onclick="AnnouncementAdminDetail.saveAnnouncement()">
                            <i class="fas fa-paper-plane"></i> 发布公告
                        </button>
                        <button class="btn btn-secondary" onclick="window.history.back()">
                            <i class="fas fa-arrow-left"></i> 返回
                        </button>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">公告标题 *</label>
                    <input type="text" class="form-input" id="editTitle" placeholder="请输入公告标题">
                </div>
                
                <div class="form-group">
                    <label class="form-label">公告类型 *</label>
                    <select class="form-select" id="editAnnouncementType">
                        <option value="1" selected>通知</option>
                        <option value="2">活动</option>
                        <option value="3">其他</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">公告范围 *</label>
                    <select class="form-select" id="editScope" onchange="AnnouncementAdminDetail.toggleDepartmentSelect()">
                        <option value="1" selected>全校</option>
                        <option value="2">院系</option>
                    </select>
                </div>
                
                <div class="form-group" id="departmentSelectGroup" style="display: none;">
                    <label class="form-label">所属院系 *</label>
                    <select class="form-select" id="editDeptId">
                        <option value="" selected>请选择院系</option>
                        ${this.departments.map(dept => `
                        <option value="${dept.id}">${ErrorHandler.escapeHtml(dept.deptName)}</option>
                        `).join('')}
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">截止时间</label>
                    <input type="datetime-local" class="form-input" id="editDeadline">
                </div>
                
                <div class="form-group">
                    <label class="form-label">是否置顶</label>
                    <select class="form-select" id="editIsTop">
                        <option value="0" selected>否</option>
                        <option value="1">是</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">置顶顺序</label>
                    <input type="number" class="form-input" id="editTopOrder" value="0" min="0">
                </div>
                
                <div class="form-group">
                    <label class="form-label">公告内容 *</label>
                    <textarea class="form-textarea" id="editContent" placeholder="请输入公告内容" rows="10"></textarea>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        document.title = '发布新公告 - 校园公告系统';
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
