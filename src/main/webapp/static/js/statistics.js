// 统计分析页面脚本

// 图表实例对象
let charts = {};

// 初始化页面
function init() {
    // 初始化选项卡切换
    initTabs();
    
    // 初始化用户名
    initUserName();
    
    // 加载部门数据
    loadDepartments();
    
    // 加载公告数据
    loadAnnouncements();
    
    // 初始化时间选择器
    initDatePickers();
    
    // 只加载总览统计数据，其他数据在标签页激活时加载
    loadTotalStatistics();
}

// 初始化选项卡切换
function initTabs() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 移除所有active类
            navTabs.forEach(t => t.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // 添加active类到当前选中的选项卡和内容
            tab.classList.add('active');
            const targetTab = tab.getAttribute('data-tab');
            const targetPane = document.getElementById(targetTab);
            targetPane.classList.add('active');
            
            // 切换到对应选项卡时重新加载数据
            switch (targetTab) {
                case 'overview':
                    loadTotalStatistics();
                    break;
                case 'announcementType':
                    loadAnnouncementTypeStatistics();
                    break;
                case 'department':
                    loadDepartmentStatistics();
                    break;
                case 'timeRange':
                    loadTimeRangeStatistics();
                    break;
                case 'readStatistics':
                    loadReadStatistics();
                    break;
            }
            
            // 选项卡切换后，为当前激活的图表容器手动触发resize事件
            // 确保图表能正确获取容器尺寸
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 100);
        });
    });
}

// 初始化用户名
function initUserName() {
    const userName = localStorage.getItem('userName');
    if (userName) {
        document.getElementById('userName').textContent = userName;
    }
}

// 退出登录
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userType');
    window.location.href = 'login.jsp';
}

// 构建API URL的辅助函数
function buildApiUrl(endpoint) {
    // 检查当前URL中是否包含上下文路径
    const currentUrl = window.location.href;
    
    if (currentUrl.includes('/campus-announce-sys/')) {
        // 如果当前URL包含上下文路径，则使用完整路径
        return '/campus-announce-sys' + endpoint;
    } else if (contextPath) {
        // 否则使用contextPath
        return contextPath + endpoint;
    } else {
        // 如果都没有，则直接使用endpoint（适用于根路径部署）
        return endpoint;
    }
}

// 加载部门数据
function loadDepartments() {
    fetch(buildApiUrl('/api/department/list'))
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Invalid JSON response');
            }
            return response.json();
        })
        .then(data => {
            if (data.code === 200) {
                const departments = Array.isArray(data.data) ? data.data : [];
                // 填充部门下拉选择框
                const selects = [
                    document.getElementById('deptSelectType'),
                    document.getElementById('deptSelectTime')
                ];
                
                selects.forEach(select => {
                    // 清空现有选项（保留第一个"全部部门"选项）
                    const options = select.querySelectorAll('option:not(:first-child)');
                    options.forEach(opt => opt.remove());
                    
                    departments.forEach(dept => {
                        const option = document.createElement('option');
                        option.value = dept.id;
                        option.textContent = dept.deptName;
                        select.appendChild(option);
                    });
                });
            }
        })
        .catch(error => {
            console.error('加载部门数据失败:', error);
        });
}

// 加载公告数据
function loadAnnouncements() {
    fetch(buildApiUrl('/api/announcement/list'))
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Invalid JSON response');
            }
            return response.json();
        })
        .then(data => {
            if (data.code === 200) {
                const announcements = Array.isArray(data.data) ? data.data : [];
                const select = document.getElementById('announcementSelect');
                
                // 清空现有选项（保留第一个"全部公告"选项）
                const options = select.querySelectorAll('option:not(:first-child)');
                options.forEach(opt => opt.remove());
                
                announcements.forEach(announcement => {
                    const option = document.createElement('option');
                    option.value = announcement.id;
                    option.textContent = announcement.title;
                    select.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('加载公告数据失败:', error);
        });
}

// 初始化时间选择器
function initDatePickers() {
    const today = new Date();
    const startDate = new Date();
    startDate.setMonth(today.getMonth() - 1); // 默认查询最近一个月
    
    document.getElementById('startDate').value = formatDate(startDate);
    document.getElementById('endDate').value = formatDate(today);
}

// 格式化日期为YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 加载总统计数据
function loadTotalStatistics() {
    fetch(buildApiUrl('/api/statistics/total'))
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Invalid JSON response');
            }
            return response.json();
        })
        .then(data => {
            if (data.code === 200) {
                renderTotalStatistics(data.data);
            }
        })
        .catch(error => {
            console.error('加载总统计数据失败:', error);
            // 显示默认值
            renderTotalStatistics({
                total_announcements: 0,
                top_announcements: 0,
                total_views: 0,
                avg_views: 0
            });
        });
}

// 渲染总统计数据
function renderTotalStatistics(data) {
    const totalStats = document.getElementById('totalStats');
    totalStats.innerHTML = `
        <div class="stat-card">
            <div class="stat-number">${data.total_announcements || 0}</div>
            <div class="stat-label">总公告数</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${data.top_announcements || 0}</div>
            <div class="stat-label">置顶公告数</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${data.total_views || 0}</div>
            <div class="stat-label">总浏览量</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${data.avg_views ? data.avg_views.toFixed(1) : 0}</div>
            <div class="stat-label">平均浏览量</div>
        </div>
    `;
}

// 加载公告类型统计
function loadAnnouncementTypeStatistics(deptId = null) {
    let url = buildApiUrl('/api/statistics/announcementType');
    
    // 确保只在deptId有实际值时添加查询参数
    // 处理null和空字符串的情况
    if (deptId !== null && deptId !== '') {
        url += `?deptId=${deptId}`;
    }
    
    console.log('开始加载公告类型统计');
    console.log('请求URL:', url);
    console.log('部门ID:', deptId, '类型:', typeof deptId);
    
    fetch(url)
        .then(response => {
            console.log('响应状态:', response.status);
            console.log('响应状态文本:', response.statusText);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contentType = response.headers.get('content-type');
            console.log('响应内容类型:', contentType);
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Invalid JSON response');
            }
            return response.json();
        })
        .then(data => {
            console.log('API返回数据:', data);
            if (data.code === 200) {
                console.log('数据状态码正常，data.data:', data.data);
                // 确保data.data是数组
                const chartData = Array.isArray(data.data) ? data.data : [];
                console.log('最终图表数据:', chartData);
                renderAnnouncementTypeChart(chartData);
            } else {
                console.error('API返回错误:', data.message);
                // 显示空数据图表
                renderAnnouncementTypeChart([]);
            }
        })
        .catch(error => {
            console.error('加载公告类型统计失败:', error);
            // 显示空数据图表
            renderAnnouncementTypeChart([]);
        });
}

// 渲染公告类型图表
function renderAnnouncementTypeChart(data, attempt = 0) {
    console.log('开始渲染公告类型图表，尝试次数:', attempt);
    console.log('数据:', data);
    
    const container = document.getElementById('announcementTypeChart');
    if (!container) {
        console.error('公告类型图表容器不存在');
        return;
    }
    
    // 检查容器是否可见
    const isVisible = container.offsetParent !== null;
    if (!isVisible) {
        console.warn('公告类型图表容器不可见，跳过渲染');
        return;
    }
    
    // 检查容器尺寸
    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
        // 添加尝试次数限制，避免无限循环
        if (attempt < 5) {
            console.warn('公告类型图表容器尺寸为0，等待重绘，尝试次数:', attempt + 1);
            // 延迟执行，等待容器尺寸更新，每次延迟时间增加
            setTimeout(() => renderAnnouncementTypeChart(data, attempt + 1), 200 * (attempt + 1));
        } else {
            console.error('公告类型图表容器尺寸为0，已尝试5次，放弃渲染');
        }
        return;
    }
    
    console.log('容器尺寸:', rect.width, 'x', rect.height);
    
    if (!charts.announcementTypeChart) {
        console.log('初始化公告类型图表');
        charts.announcementTypeChart = echarts.init(container);
    }
    
    // 处理数据
    const typeMap = {
        1: '通知',
        2: '活动',
        3: '其他'
    };
    
    const categories = [];
    const chartSeriesData = [];
    
    // 确保data是数组
    const chartData = Array.isArray(data) ? data : [];
    
    if (chartData.length > 0) {
        chartData.forEach(item => {
            const typeName = typeMap[item.announcement_type] || `类型${item.announcement_type}`;
            categories.push(typeName);
            chartSeriesData.push({
                name: typeName,
                value: item.count || 0
            });
        });
    } else {
        console.error('公告类型数据为空数组或不是数组:', data);
        // 添加默认数据，确保图表能显示
        const defaultData = [
            { name: '通知', value: 0 },
            { name: '活动', value: 0 },
            { name: '其他', value: 0 }
        ];
        chartSeriesData.push(...defaultData);
        categories.push('通知', '活动', '其他');
    }
    
    console.log('系列数据:', chartSeriesData);
    console.log('图例数据:', categories);
    
    const option = {
        title: {
            text: '公告类型分布',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: categories
        },
        series: [
            {
                name: '公告类型',
                type: 'pie',
                radius: '50%',
                center: ['50%', '60%'],
                data: chartSeriesData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                label: {
                    formatter: '{b}: {c} ({d}%)'
                }
            }
        ]
    };
    
    try {
        charts.announcementTypeChart.setOption(option);
        console.log('公告类型图表已渲染');
    } catch (error) {
        console.error('公告类型图表渲染失败:', error);
    }
}

// 过滤公告类型统计
function filterAnnouncementType() {
    const deptId = document.getElementById('deptSelectType').value;
    console.log('用户选择的部门ID:', deptId, '类型:', typeof deptId);
    
    // 处理部门ID为空字符串的情况
    const actualDeptId = deptId === '' ? null : deptId;
    console.log('实际传递的部门ID:', actualDeptId);
    
    loadAnnouncementTypeStatistics(actualDeptId);
}

// 加载部门统计
function loadDepartmentStatistics() {
    fetch(buildApiUrl('/api/statistics/department'))
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Invalid JSON response');
            }
            return response.json();
        })
        .then(data => {
            if (data.code === 200) {
                const chartData = Array.isArray(data.data) ? data.data : [];
                // 只渲染部门公告分布图表和表格，移除柱形图
                renderDepartmentTable(chartData);
                renderDepartmentOverviewChart(chartData);
            }
        })
        .catch(error => {
            console.error('加载部门统计失败:', error);
            // 显示空数据表格和图表
            renderDepartmentTable([]);
            renderDepartmentOverviewChart([]);
        });
}

// 渲染部门公告分布图表（总览）
function renderDepartmentOverviewChart(data, attempt = 0) {
    console.log('开始渲染部门公告分布图表，尝试次数:', attempt);
    console.log('数据:', data);
    
    const container = document.getElementById('departmentChart');
    if (!container) {
        console.error('部门公告分布图表容器不存在');
        return;
    }
    
    // 检查容器是否可见
    const isVisible = container.offsetParent !== null;
    if (!isVisible) {
        console.warn('部门公告分布图表容器不可见，跳过渲染');
        return;
    }
    
    // 检查容器尺寸
    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
        // 添加尝试次数限制，避免无限循环
        if (attempt < 5) {
            console.warn('部门公告分布图表容器尺寸为0，等待重绘，尝试次数:', attempt + 1);
            // 延迟执行，等待容器尺寸更新，每次延迟时间增加
            setTimeout(() => renderDepartmentOverviewChart(data, attempt + 1), 200 * (attempt + 1));
        } else {
            console.error('部门公告分布图表容器尺寸为0，已尝试5次，放弃渲染');
        }
        return;
    }
    
    console.log('容器尺寸:', rect.width, 'x', rect.height);
    
    if (!charts.departmentChart) {
        console.log('初始化部门公告分布图表');
        charts.departmentChart = echarts.init(container);
    }
    
    // 确保data是数组
    const chartData = Array.isArray(data) ? data : [];
    console.log('处理后的数据:', chartData);
    
    // 处理数据，确保有可用数据
    let seriesData = [];
    let legendData = [];
    
    if (chartData.length > 0) {
        seriesData = chartData.map(item => ({
            name: item.dept_name || '未知部门',
            value: item.announcement_count || 0
        }));
        legendData = chartData.map(item => item.dept_name || '未知部门');
    } else {
        // 添加默认数据，确保图表能显示
        seriesData = [{ name: '暂无数据', value: 1 }];
        legendData = ['暂无数据'];
    }
    
    console.log('系列数据:', seriesData);
    console.log('图例数据:', legendData);
    
    const option = {
        title: {
            text: '部门公告分布',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: legendData
        },
        series: [
            {
                name: '部门公告',
                type: 'pie',
                radius: '50%',
                center: ['50%', '60%'],
                data: seriesData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                label: {
                    formatter: '{b}: {c} ({d}%)'
                }
            }
        ]
    };
    
    try {
        charts.departmentChart.setOption(option);
        console.log('部门公告分布图表渲染成功');
    } catch (error) {
        console.error('部门公告分布图表渲染失败:', error);
    }
}

// 渲染部门公告图表（已移除，不再使用）
function renderDepartmentChart(data) {
    // 此函数已被移除，不再使用
    console.log('renderDepartmentChart函数已被移除，不再使用');
}

// 渲染部门统计表格
function renderDepartmentTable(data) {
    const tbody = document.getElementById('departmentTable').querySelector('tbody');
    tbody.innerHTML = '';
    
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.dept_name}</td>
            <td>${item.dept_code}</td>
            <td>${item.announcement_count}</td>
        `;
        tbody.appendChild(row);
    });
}

// 加载时间范围统计
function loadTimeRangeStatistics(startTime = '', endTime = '', deptId = '') {
    // 加强调试：输出函数调用信息
    console.log('=== loadTimeRangeStatistics 函数调用 ===');
    console.log('原始参数 - startTime:', startTime, 'endTime:', endTime, 'deptId:', deptId);
    
    // 如果没有提供时间，使用默认时间范围（最近30天）
    if (!startTime || !endTime) {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 30);
        
        // 将时间调整到当天的开始和结束时间，确保完整的日期范围
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        
        startTime = start.getTime().toString();
        endTime = end.getTime().toString();
    }
    
    // 加强调试：输出处理后的时间范围
    console.log('处理后的时间范围:');
    console.log('开始时间戳:', startTime, '对应日期:', new Date(parseInt(startTime)).toISOString());
    console.log('结束时间戳:', endTime, '对应日期:', new Date(parseInt(endTime)).toISOString());
    
    let url = `${buildApiUrl('/api/statistics/timeRange')}?startTime=${startTime}&endTime=${endTime}`;
    if (deptId) {
        url += `&deptId=${deptId}`;
    }
    
    // 加强调试：输出请求URL
    console.log('请求URL:', url);
    
    fetch(url)
        .then(response => {
            // 加强调试：输出响应状态
            console.log('响应状态:', response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Invalid JSON response');
            }
            return response.json();
        })
        .then(data => {
            // 加强调试：输出完整响应数据
            console.log('API返回完整数据:', data);
            if (data.code === 200) {
                const chartData = Array.isArray(data.data) ? data.data : [];
                // 加强调试：输出图表数据
                console.log('图表原始数据:', chartData);
                renderTimeRangeChart(chartData);
            }
        })
        .catch(error => {
            console.error('加载时间范围统计失败:', error);
            // 显示空数据图表
            renderTimeRangeChart([]);
        });
}

// 渲染时间趋势图表
function renderTimeRangeChart(data, attempt = 0) {
    // 加强调试：输出函数调用信息
    console.log('=== renderTimeRangeChart 函数调用 ===');
    console.log('尝试次数:', attempt, '数据长度:', data.length);
    
    const container = document.getElementById('timeRangeChart');
    if (!container) {
        console.error('时间趋势图表容器不存在');
        return;
    }
    
    // 检查容器是否可见
    const isVisible = container.offsetParent !== null;
    if (!isVisible) {
        console.warn('时间趋势图表容器不可见，跳过渲染');
        return;
    }
    
    // 检查容器尺寸
    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
        // 添加尝试次数限制，避免无限循环
        if (attempt < 5) {
            console.warn('时间趋势图表容器尺寸为0，等待重绘，尝试次数:', attempt + 1);
            // 延迟执行，等待容器尺寸更新，每次延迟时间增加
            setTimeout(() => renderTimeRangeChart(data, attempt + 1), 200 * (attempt + 1));
        } else {
            console.error('时间趋势图表容器尺寸为0，已尝试5次，放弃渲染');
        }
        return;
    }
    
    if (!charts.timeRangeChart) {
        charts.timeRangeChart = echarts.init(container);
    }
    
    // 确保data是数组
    const chartData = Array.isArray(data) ? data : [];
    
    // 加强调试：输出原始数据
    console.log('渲染前原始数据:', chartData);
    
    // 格式化日期，确保显示正确的时间
    const formattedData = chartData.map((item, index) => {
        console.log(`=== 处理第${index}个数据项 ===`);
        console.log('原始数据项:', item);
        
        // 处理日期格式，确保显示为YYYY-MM-DD格式
        let formattedDate = item.publish_date || '';
        
        console.log('处理前的publish_date:', formattedDate, '类型:', typeof formattedDate);
        
        // 处理时间戳情况（数字类型）
        if (typeof formattedDate === 'number') {
            // 将时间戳转换为Date对象，然后格式化为YYYY-MM-DD
            const date = new Date(formattedDate);
            
            // 加强调试：输出时区信息
            console.log('数字时间戳:', formattedDate);
            console.log('UTC时间:', date.toISOString());
            console.log('本地时间:', date.toLocaleString());
            console.log('本地时间戳:', date.getTime());
            
            // 使用本地时区获取日期，解决时区差异问题
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            formattedDate = `${year}-${month}-${day}`;
            
            console.log('数字时间戳转换结果 - UTC格式化:', date.toISOString().split('T')[0]);
            console.log('数字时间戳转换结果 - 本地格式化:', formattedDate);
        } 
        // 处理字符串类型
        else if (formattedDate && typeof formattedDate === 'string') {
            // 如果是时间戳字符串，转换为数字后处理
            if (/^\d+$/.test(formattedDate)) {
                const timestamp = parseInt(formattedDate, 10);
                const date = new Date(timestamp);
                
                // 加强调试：输出时区信息
                console.log('字符串时间戳:', formattedDate);
                console.log('UTC时间:', date.toISOString());
                console.log('本地时间:', date.toLocaleString());
                
                // 使用本地时区获取日期，解决时区差异问题
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                formattedDate = `${year}-${month}-${day}`;
                
                console.log('字符串时间戳转换结果 - UTC格式化:', date.toISOString().split('T')[0]);
                console.log('字符串时间戳转换结果 - 本地格式化:', formattedDate);
            }
            // 如果是完整的ISO格式日期，截取前面的日期部分
            else if (formattedDate.includes('T')) {
                // 解析ISO字符串，注意时区处理
                const date = new Date(formattedDate);
                
                // 加强调试：输出时区信息
                console.log('ISO字符串:', formattedDate);
                console.log('解析后UTC时间:', date.toISOString());
                console.log('解析后本地时间:', date.toLocaleString());
                
                // 使用本地时区获取日期，解决时区差异问题
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                formattedDate = `${year}-${month}-${day}`;
                
                console.log('ISO日期转换结果 - UTC格式化:', formattedDate.split('T')[0]);
                console.log('ISO日期转换结果 - 本地格式化:', formattedDate);
            }
            // 直接日期字符串
            else {
                console.log('直接日期字符串:', formattedDate);
                
                // 验证日期格式，确保是YYYY-MM-DD格式
                const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                if (!dateRegex.test(formattedDate)) {
                    console.warn('日期格式不符合YYYY-MM-DD:', formattedDate);
                    
                    // 尝试解析并重新格式化
                    const date = new Date(formattedDate);
                    if (!isNaN(date.getTime())) {
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        formattedDate = `${year}-${month}-${day}`;
                        console.log('重新格式化后的日期:', formattedDate);
                    }
                }
            }
        } 
        // 处理Date对象
        else if (formattedDate instanceof Date) {
            // 如果是Date对象，格式化为YYYY-MM-DD
            
            // 加强调试：输出时区信息
            console.log('Date对象UTC时间:', formattedDate.toISOString());
            console.log('Date对象本地时间:', formattedDate.toLocaleString());
            
            // 使用本地时区获取日期，解决时区差异问题
            const year = formattedDate.getFullYear();
            const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
            const day = String(formattedDate.getDate()).padStart(2, '0');
            formattedDate = `${year}-${month}-${day}`;
            
            console.log('Date对象转换结果:', formattedDate);
        } else {
            console.log('未处理的日期格式:', formattedDate, '类型:', typeof formattedDate);
        }
        
        // 加强调试：输出处理结果
        const resultItem = {
            ...item,
            publish_date: formattedDate
        };
        console.log('处理后的结果:', resultItem);
        
        return resultItem;
    });
    
    // 加强调试：输出格式化后的数据
    console.log('格式化后的数据:', formattedData);
    
    const option = {
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                // 自定义tooltip格式，确保日期显示正确
                console.log('tooltip触发数据:', params);
                let result = params[0].name + '<br/>';
                params.forEach(param => {
                    result += param.marker + param.seriesName + ': ' + param.value + '<br/>';
                });
                return result;
            }
        },
        xAxis: {
            type: 'category',
            data: formattedData.map(item => item.publish_date || ''),
            axisLabel: {
                rotate: 45,
                formatter: function(value) {
                    // 确保日期显示为YYYY-MM-DD格式
                    if (value && typeof value === 'string' && value.length > 10) {
                        return value.substring(0, 10);
                    }
                    return value;
                }
            }
        },
        yAxis: {
            type: 'value',
            minInterval: 1 // 确保Y轴只显示整数
        },
        series: [
            {
                name: '公告数量',
                type: 'line',
                smooth: true,
                data: formattedData.map(item => item.count || 0),
                lineStyle: {
                    color: '#667eea'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {offset: 0, color: 'rgba(102, 126, 234, 0.5)'},
                        {offset: 1, color: 'rgba(102, 126, 234, 0.1)'}
                    ])
                }
            }
        ]
    };
    
    // 加强调试：输出图表配置
    console.log('图表配置:', option);
    
    charts.timeRangeChart.setOption(option);
    
    // 加强调试：输出渲染完成信息
    console.log('=== 公告发布时间趋势图表渲染完成 ===');
}

// 过滤时间范围统计
function filterTimeRange() {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    const deptId = document.getElementById('deptSelectTime').value;
    
    // 设置开始时间为当天的00:00:00
    startDate.setHours(0, 0, 0, 0);
    // 设置结束时间为当天的23:59:59
    endDate.setHours(23, 59, 59, 999);
    
    const startTime = startDate.getTime().toString();
    const endTime = endDate.getTime().toString();
    
    loadTimeRangeStatistics(startTime, endTime, deptId);
}

// 加载阅读统计
function loadReadStatistics(announcementId = '') {
    let url = buildApiUrl('/api/statistics/announcementRead');
    if (announcementId) {
        url += `?announcementId=${announcementId}`;
    }
    
    console.log('%c=== 加载阅读统计 ===', 'font-weight: bold; color: #4CAF50;');
    console.log('请求URL:', url);
    console.log('公告ID:', announcementId);
    console.log('当前时间:', new Date().toLocaleString());
    
    // 添加详细的请求日志
    console.log('请求配置:', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include' // 确保携带cookie
    })
        .then(response => {
            console.log('%c=== API响应 ===', 'font-weight: bold; color: #2196F3;');
            console.log('响应状态:', response.status, response.statusText);
            console.log('响应状态完整:', response);
            console.log('响应头:', Object.fromEntries(response.headers.entries()));
            
            // 添加响应文本的调试
            return response.text().then(text => {
                console.log('响应原始文本:', text);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}, response: ${text}`);
                }
                
                // 尝试解析JSON
                try {
                    return JSON.parse(text);
                } catch (e) {
                    console.error('JSON解析失败:', e);
                    throw new Error('Invalid JSON response: ' + text);
                }
            });
        })
        .then(data => {
            console.log('%c=== API返回数据处理 ===', 'font-weight: bold; color: #FF9800;');
            console.log('API返回完整数据:', data);
            console.log('数据类型:', typeof data);
            console.log('数据code:', data.code);
            console.log('数据message:', data.message);
            console.log('data.data类型:', typeof data.data);
            console.log('data.data是数组:', Array.isArray(data.data));
            
            if (data.code === 200) {
                const chartData = Array.isArray(data.data) ? data.data : [];
                console.log('处理后的数据:', chartData);
                console.log('处理后的数据长度:', chartData.length);
                
                // 打印每个数据项的详细信息
                chartData.forEach((item, index) => {
                    console.log(`数据项${index}:`, item);
                    console.log(`  announcement_id:`, item.announcement_id);
                    console.log(`  title:`, item.title);
                    console.log(`  announcement_type:`, item.announcement_type);
                    console.log(`  publish_time:`, item.publish_time, ' -> ', new Date(item.publish_time).toLocaleString());
                    console.log(`  read_count:`, item.read_count);
                    console.log(`  total_users:`, item.total_users);
                    console.log(`  unread_count:`, item.unread_count);
                });
                
                renderReadStatisticsChart(chartData);
                renderReadStatisticsTable(chartData);
            } else {
                console.error('API返回错误:', data.message);
                // 显示空数据图表和表格
                renderReadStatisticsChart([]);
                renderReadStatisticsTable([]);
            }
        })
        .catch(error => {
            console.error('%c=== 加载阅读统计失败 ===', 'font-weight: bold; color: #F44336;');
            console.error('错误对象:', error);
            console.error('错误信息:', error.message);
            console.error('错误堆栈:', error.stack);
            
            // 直接显示空数据，不使用模拟数据
            console.log('API返回错误，显示空数据');
            renderReadStatisticsChart([]);
            renderReadStatisticsTable([]);
        })
        .finally(() => {
            console.log('%c=== 加载阅读统计完成 ===', 'font-weight: bold; color: #9C27B0;');
        });
}

// 渲染阅读统计图表
function renderReadStatisticsChart(data, attempt = 0) {
    const container = document.getElementById('readStatisticsChart');
    if (!container) {
        console.error('阅读统计图表容器不存在');
        return;
    }
    
    // 检查容器是否可见
    const isVisible = container.offsetParent !== null;
    if (!isVisible) {
        console.warn('阅读统计图表容器不可见，跳过渲染');
        return;
    }
    
    // 检查容器尺寸
    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
        // 添加尝试次数限制，避免无限循环
        if (attempt < 5) {
            console.warn('阅读统计图表容器尺寸为0，等待重绘，尝试次数:', attempt + 1);
            // 延迟执行，等待容器尺寸更新，每次延迟时间增加
            setTimeout(() => renderReadStatisticsChart(data, attempt + 1), 200 * (attempt + 1));
        } else {
            console.error('阅读统计图表容器尺寸为0，已尝试5次，放弃渲染');
            // 手动设置容器最小尺寸，确保图表能显示
            container.style.minHeight = '400px';
            container.style.minWidth = '600px';
            // 强制重新渲染
            charts.readStatisticsChart && charts.readStatisticsChart.resize();
        }
        return;
    }
    
    if (!charts.readStatisticsChart) {
        charts.readStatisticsChart = echarts.init(container);
    }
    
    // 确保data是数组
    const originalData = Array.isArray(data) ? data : [];
    
    // 只取前10条数据用于图表展示
    const chartData = originalData.slice(0, 10);
    
    // 处理数据为空的情况
    const displayData = chartData.length > 0 ? chartData : [
        { title: '暂无数据', announcement_type: 1, publish_time: new Date(), read_count: 0, unread_count: 0, total_users: 0 }
    ];
    
    const option = {
        // 添加合适的margin，确保图表内容不被裁剪
        grid: {
            top: 80,
            right: 30,
            bottom: 120, // 增加底部边距，确保x轴标签完整显示
            left: 80,    // 增加左侧边距，确保y轴标签完整显示
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params) {
                // 自定义tooltip，显示完整标题
                let result = params[0].axisValue + '<br/>';
                params.forEach(param => {
                    result += param.marker + param.seriesName + ': ' + param.value + '<br/>';
                });
                return result;
            }
        },
        legend: {
            data: ['阅读数', '未读数'],
            top: 30, // 调整图例位置
            textStyle: {
                fontSize: 12
            }
        },
        xAxis: {
            type: 'category',
            data: displayData.map(item => {
                const title = item.title || '未知标题';
                // 优化标题显示，确保能完整显示
                return title.length > 15 ? title.substring(0, 15) + '...' : title;
            }),
            axisLabel: {
                rotate: 45,
                fontSize: 10, // 调整标签字体大小
                formatter: function(value) {
                    // 确保标题能完整显示
                    return value.length > 15 ? value.substring(0, 15) + '...' : value;
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#ccc'
                }
            }
        },
        yAxis: {
            type: 'value',
            minInterval: 1, // 确保Y轴只显示整数
            axisLabel: {
                fontSize: 12
            },
            axisLine: {
                lineStyle: {
                    color: '#ccc'
                }
            },
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                    color: '#f0f0f0'
                }
            }
        },
        series: [
            {
                name: '阅读数',
                type: 'bar',
                data: displayData.map(item => item.read_count || 0),
                itemStyle: {
                    color: '#667eea'
                },
                barWidth: '60%' // 调整柱子宽度，占满可用空间
            }
        ]
    };
    
    charts.readStatisticsChart.setOption(option);
    
    // 强制调整图表大小，确保完整显示
    charts.readStatisticsChart.resize();
}

// 渲染阅读统计表格
function renderReadStatisticsTable(data) {
    const tbody = document.getElementById('readStatisticsTable').querySelector('tbody');
    tbody.innerHTML = '';
    
    const typeMap = {
        1: '通知',
        2: '活动',
        3: '其他'
    };
    
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.title}</td>
            <td>${typeMap[item.announcement_type] || `类型${item.announcement_type}`}</td>
            <td>${new Date(item.publish_time).toLocaleString()}</td>
            <td>${item.read_count}</td>
            <td>${item.total_users}</td>
        `;
        tbody.appendChild(row);
    });
}

// 过滤阅读统计
function filterReadStatistics() {
    const announcementId = document.getElementById('announcementSelect').value;
    loadReadStatistics(announcementId);
}



// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);

// 窗口大小变化时，调整图表大小
window.addEventListener('resize', () => {
    for (const chartName in charts) {
        if (charts[chartName]) {
            charts[chartName].resize();
        }
    }
});