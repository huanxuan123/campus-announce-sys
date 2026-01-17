<%@ page contentType="text/html;charset=UTF-8" language="java" %>  
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>统计分析 - 校园公告系统</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Microsoft YaHei', Arial, sans-serif;
            background: #f5f5f5;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .header h1 {
            font-size: 24px;
        }
        
        .user-info {
            display: flex;
            align-items: center;
            gap: 20px;
        }
        
        .user-info span {
            font-size: 14px;
        }
        
        .btn-logout {
            padding: 8px 20px;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .btn-logout:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        
        .container {
            max-width: 1200px;
            margin: 40px auto;
            padding: 0 20px;
        }
        
        .nav-tabs {
            display: flex;
            gap: 10px;
            background: white;
            padding: 10px;
            border-radius: 10px 10px 0 0;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .nav-tab {
            padding: 12px 24px;
            border: none;
            background: transparent;
            color: #666;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 14px;
        }
        
        .nav-tab.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        .nav-tab:hover:not(.active) {
            background: #f0f0f0;
        }
        
        .tab-content {
            background: white;
            padding: 30px;
            border-radius: 0 0 10px 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            margin-bottom: 30px;
        }
        
        .tab-pane {
            display: none;
        }
        
        .tab-pane.active {
            display: block;
        }
        
        .chart-container {
            margin: 30px 0;
        }
        
        .chart {
            height: 400px;
            margin-top: 20px;
        }
        
        .total-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        
        .stat-card {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .stat-number {
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
        }
        
        .stat-label {
            font-size: 14px;
            color: #666;
            margin-top: 10px;
        }
        
        .filter-section {
            display: flex;
            gap: 20px;
            margin: 20px 0;
            flex-wrap: wrap;
        }
        
        .filter-item {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        
        .filter-item label {
            font-size: 14px;
            color: #666;
        }
        
        .filter-item select,
        .filter-item input {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
        }
        
        .btn-filter {
            padding: 8px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s;
            align-self: flex-end;
        }
        
        .btn-filter:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        .table-container {
            overflow-x: auto;
            margin-top: 20px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
        }
        
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        
        th {
            background: #f5f5f5;
            font-weight: bold;
            color: #333;
        }
        
        tr:hover {
            background: #f9f9f9;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>校园公告系统</h1>
        <div class="user-info">
            <span id="userName">加载中...</span>
            <button class="btn-logout" onclick="logout()">退出登录</button>
        </div>
    </div>
    
    <div class="container">
        <div class="nav-tabs">
            <button class="nav-tab active" data-tab="overview">总览统计</button>
            <button class="nav-tab" data-tab="announcementType">公告类型</button>
            <button class="nav-tab" data-tab="department">部门统计</button>
            <button class="nav-tab" data-tab="timeRange">时间趋势</button>
            <button class="nav-tab" data-tab="readStatistics">阅读统计</button>
        </div>
        
        <div class="tab-content">
            <!-- 总览统计 -->
            <div class="tab-pane active" id="overview">
                <h2>系统公告总览</h2>
                <div class="total-stats" id="totalStats"></div>
                <!-- 部门公告分布已移至部门统计 -->
            </div>
            
            <!-- 公告类型统计 -->
            <div class="tab-pane" id="announcementType">
                <h2>公告类型统计</h2>
                <div class="filter-section">
                    <div class="filter-item">
                        <label for="deptSelectType">部门筛选</label>
                        <select id="deptSelectType">
                            <option value="">全部部门</option>
                        </select>
                    </div>
                    <button class="btn-filter" onclick="filterAnnouncementType()">查询</button>
                </div>
                <div class="chart-container">
                    <h3>公告类型分布</h3>
                    <div id="announcementTypeChart" class="chart"></div>
                </div>
            </div>
            
            <!-- 部门统计 -->
            <div class="tab-pane" id="department">
                <h2>部门公告统计</h2>
                <div class="chart-container">
                    <h3>部门公告分布</h3>
                    <div id="departmentChart" class="chart"></div>
                </div>
                <div class="table-container">
                    <table id="departmentTable">
                        <thead>
                            <tr>
                                <th>部门名称</th>
                                <th>部门代码</th>
                                <th>公告数量</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
            
            <!-- 时间趋势 -->
            <div class="tab-pane" id="timeRange">
                <h2>公告发布时间趋势</h2>
                <div class="filter-section">
                    <div class="filter-item">
                        <label for="startDate">开始日期</label>
                        <input type="date" id="startDate">
                    </div>
                    <div class="filter-item">
                        <label for="endDate">结束日期</label>
                        <input type="date" id="endDate">
                    </div>
                    <div class="filter-item">
                        <label for="deptSelectTime">部门筛选</label>
                        <select id="deptSelectTime">
                            <option value="">全部部门</option>
                        </select>
                    </div>
                    <button class="btn-filter" onclick="filterTimeRange()">查询</button>
                </div>
                <div class="chart-container">
                    <h3>每日公告发布数量</h3>
                    <div id="timeRangeChart" class="chart"></div>
                </div>
            </div>
            
            <!-- 阅读统计 -->
            <div class="tab-pane" id="readStatistics">
                <h2>公告阅读统计</h2>
                <div class="filter-section">
                    <div class="filter-item">
                        <label for="announcementSelect">选择公告</label>
                        <select id="announcementSelect">
                            <option value="">全部公告</option>
                        </select>
                    </div>
                    <button class="btn-filter" onclick="filterReadStatistics()">查询</button>
                </div>
                <div class="chart-container">
                    <h3>公告阅读情况</h3>
                    <div id="readStatisticsChart" class="chart"></div>
                </div>
                <div class="table-container">
                    <table id="readStatisticsTable">
                        <thead>
                            <tr>
                                <th>公告标题</th>
                                <th>公告类型</th>
                                <th>发布时间</th>
                                <th>阅读数</th>
                                <th>总用户数</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    
    <!-- 引入ECharts -->
    <script src="${pageContext.request.contextPath}/static/lib/echarts/echarts.min.js"></script>
    <!-- 引入通用工具和业务逻辑 -->
    <script>
        // 设置全局配置
        var contextPath = '${pageContext.request.contextPath}';
    </script>
    <script src="${pageContext.request.contextPath}/static/js/common.js"></script>
    <script src="${pageContext.request.contextPath}/static/js/statistics.js"></script>
</body>
</html>