// 全局变量
let currentPage = 'dashboard';
let products = [];
let donations = [];
let applications = [];

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 检查登录状态
    checkLogin();
    
    // 初始化数据
    initData();
    
    // 渲染页面
    renderPage();
    
    // 初始化图表
    initCharts();
    
    // 绑定事件
    bindEvents();
});

// 检查登录状态
function checkLogin() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const username = localStorage.getItem('username');
    
    if (!isLoggedIn || isLoggedIn !== 'true') {
        window.location.href = 'login.html';
        return;
    }
    
    // 更新当前用户名
    if (username) {
        document.getElementById('currentUsername').textContent = username;
    }
}

// 初始化数据
function initData() {
    // 产品数据
    products = [
        { id: 1, name: 'OpenClaw Shield Pro', version: 'v2.5.1', price: '企业定制', status: 'active', created: '2024-01-15' },
        { id: 2, name: 'ClawScanner 专业版', version: 'v3.2.0', price: 'OEM定制', status: 'active', created: '2024-02-20' },
        { id: 3, name: 'AI安全审计平台', version: 'v1.0.0-beta', price: '免费版', status: 'inactive', created: '2024-03-01' }
    ];
    
    // 捐款数据
    donations = [
        { id: 1, name: '张三', amount: 500, method: 'wechat', status: 'confirmed', time: '2024-03-10 10:30' },
        { id: 2, name: '李四公司', amount: 5000, method: 'bank', status: 'confirmed', time: '2024-03-09 15:20' },
        { id: 3, name: '王五', amount: 200, method: 'alipay', status: 'pending', time: '2024-03-08 09:45' }
    ];
    
    // 申请数据
    applications = [
        { id: 1, type: 'partner', name: 'XX科技公司', contact: '13800138000', time: '2024-03-10 14:30', status: 'pending' },
        { id: 2, type: 'donate', name: '赵六', contact: 'zhaoliu@email.com', time: '2024-03-09 11:20', status: 'processed' },
        { id: 3, type: 'partner', name: 'YY安全公司', contact: '13900139000', time: '2024-03-08 16:45', status: 'processed' }
    ];
}

// 渲染页面
function renderPage() {
    renderProductTable();
    renderDonationTable();
    renderApplicationTable();
}

// 渲染产品表格
function renderProductTable() {
    const tbody = document.getElementById('productTableBody');
    tbody.innerHTML = products.map(product => `
        <tr>
            <td><strong>${product.name}</strong></td>
            <td><span style="color:var(--brand-purple)">${product.version}</span></td>
            <td>${product.price}</td>
            <td><span class="badge ${product.status}">${product.status === 'active' ? '上架' : '下架'}</span></td>
            <td>${product.created}</td>
            <td>
                <button class="btn-edit" onclick="editProduct(${product.id})">编辑</button>
                <button class="btn-delete" onclick="deleteProduct(${product.id})">删除</button>
            </td>
        </tr>
    `).join('');
}

// 渲染捐款表格
function renderDonationTable() {
    const tbody = document.getElementById('donationTableBody');
    tbody.innerHTML = donations.map(donation => `
        <tr>
            <td><strong>${donation.name}</strong></td>
            <td style="color:var(--success-green); font-weight:bold;">¥${donation.amount.toLocaleString()}</td>
            <td>${getMethodText(donation.method)}</td>
            <td>${donation.time}</td>
            <td><span class="badge ${donation.status}">${donation.status === 'confirmed' ? '已确认' : '待确认'}</span></td>
            <td>
                <button class="btn-edit" onclick="editDonation(${donation.id})">编辑</button>
                <button class="btn-delete" onclick="deleteDonation(${donation.id})">删除</button>
            </td>
        </tr>
    `).join('');
}

// 渲染申请表格
function renderApplicationTable() {
    const typeFilter = document.getElementById('appFilter')?.value || 'all';
    const statusFilter = document.getElementById('statusFilter')?.value || 'all';
    
    let filtered = applications.filter(app => {
        if (typeFilter !== 'all' && app.type !== typeFilter) return false;
        if (statusFilter !== 'all' && app.status !== statusFilter) return false;
        return true;
    });
    
    const tbody = document.getElementById('applicationTableBody');
    tbody.innerHTML = filtered.map(app => `
        <tr>
            <td><span class="badge">${app.type === 'partner' ? '商业合作' : '公益赞助'}</span></td>
            <td><strong>${app.name}</strong></td>
            <td>${app.contact}</td>
            <td>${app.time}</td>
            <td><span class="badge ${app.status}">${app.status === 'processed' ? '已处理' : '待处理'}</span></td>
            <td>
                <button class="btn-edit" onclick="viewApplication(${app.id})">查看</button>
                ${app.status === 'pending' ? `<button class="btn-edit" onclick="processApplication(${app.id})">处理</button>` : ''}
            </td>
        </tr>
    `).join('');
}

// 获取支付方式文本
function getMethodText(method) {
    const map = {
        'online': '在线支付',
        'bank': '银行转账',
        'wechat': '微信支付',
        'alipay': '支付宝'
    };
    return map[method] || method;
}

// 绑定事件
function bindEvents() {
    // 导航点击
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            navigateTo(page);
        });
    });
    
    // 搜索输入
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            handleSearch(this.value);
        });
    }
    
    // 筛选器
    const appFilter = document.getElementById('appFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (appFilter) {
        appFilter.addEventListener('change', renderApplicationTable);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', renderApplicationTable);
    }
    
    // 点击模态框外部关闭
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
}

// 导航切换
function navigateTo(page) {
    // 更新导航状态
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`.nav-item[data-page="${page}"]`).classList.add('active');
    
    // 切换页面
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    document.getElementById(`page-${page}`).classList.add('active');
    
    currentPage = page;
    
    // 移动端关闭侧边栏
    if (window.innerWidth <= 768) {
        document.querySelector('.sidebar').classList.remove('show');
    }
}

// 切换侧边栏
function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('show');
}

// 搜索处理
function handleSearch(query) {
    if (!query.trim()) {
        renderProductTable();
        renderDonationTable();
        renderApplicationTable();
        return;
    }
    
    query = query.toLowerCase();
    
    // 过滤产品
    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.version.toLowerCase().includes(query)
    );
    
    // 过滤捐款
    const filteredDonations = donations.filter(d => 
        d.name.toLowerCase().includes(query)
    );
    
    // 更新表格
    // (实际项目中需要更复杂的搜索逻辑)
}

// 初始化图表
function initCharts() {
    // 访问趋势图
    const visitCtx = document.getElementById('visitChart');
    if (visitCtx) {
        new Chart(visitCtx, {
            type: 'line',
            data: {
                labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                datasets: [{
                    label: '访问量',
                    data: [1200, 1900, 1500, 2100, 1800, 2400, 2100],
                    borderColor: '#6B4FF0',
                    backgroundColor: 'rgba(107, 79, 240, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#9CA3AF'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#9CA3AF'
                        }
                    }
                }
            }
        });
    }
    
    // 捐款来源图
    const donationCtx = document.getElementById('donationChart');
    if (donationCtx) {
        new Chart(donationCtx, {
            type: 'doughnut',
            data: {
                labels: ['微信支付', '支付宝', '银行转账', '在线支付'],
                datasets: [{
                    data: [45, 30, 15, 10],
                    backgroundColor: [
                        '#6B4FF0',
                        '#0056D2',
                        '#10B981',
                        '#FF5722'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#FFFFFF',
                            padding: 20
                        }
                    }
                }
            }
        });
    }
}

// 打开模态框
function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
    
    // 如果是编辑模式，重置表单
    if (modalId === 'productModal') {
        document.getElementById('productForm').reset();
        document.getElementById('productId').value = '';
    } else if (modalId === 'donationModal') {
        document.getElementById('donationForm').reset();
        document.getElementById('donationId').value = '';
    }
}

// 关闭模态框
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// 编辑产品
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productVersion').value = product.version;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStatus').value = product.status;
    
    openModal('productModal');
}

// 保存产品
function saveProduct() {
    const id = document.getElementById('productId').value;
    const name = document.getElementById('productName').value;
    const version = document.getElementById('productVersion').value;
    const price = document.getElementById('productPrice').value;
    const status = document.getElementById('productStatus').value;
    
    if (!name || !version) {
        alert('请填写必填项');
        return;
    }
    
    if (id) {
        // 更新
        const index = products.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            products[index] = { ...products[index], name, version, price, status };
        }
    } else {
        // 新增
        const newProduct = {
            id: products.length + 1,
            name,
            version,
            price,
            status,
            created: new Date().toISOString().split('T')[0]
        };
        products.push(newProduct);
    }
    
    renderProductTable();
    closeModal('productModal');
}

// 删除产品
function deleteProduct(id) {
    if (confirm('确定要删除该产品吗？')) {
        products = products.filter(p => p.id !== id);
        renderProductTable();
    }
}

// 编辑捐款
function editDonation(id) {
    const donation = donations.find(d => d.id === id);
    if (!donation) return;
    
    document.getElementById('donationId').value = donation.id;
    document.getElementById('donorName').value = donation.name;
    document.getElementById('donationAmount').value = donation.amount;
    document.getElementById('donationMethod').value = donation.method;
    document.getElementById('donationStatus').value = donation.status;
    
    openModal('donationModal');
}

// 保存捐款
function saveDonation() {
    const id = document.getElementById('donationId').value;
    const name = document.getElementById('donorName').value;
    const amount = document.getElementById('donationAmount').value;
    const method = document.getElementById('donationMethod').value;
    const status = document.getElementById('donationStatus').value;
    
    if (!name || !amount) {
        alert('请填写必填项');
        return;
    }
    
    if (id) {
        // 更新
        const index = donations.findIndex(d => d.id === parseInt(id));
        if (index !== -1) {
            donations[index] = { ...donations[index], name, amount: parseInt(amount), method, status };
        }
    } else {
        // 新增
        const newDonation = {
            id: donations.length + 1,
            name,
            amount: parseInt(amount),
            method,
            status,
            time: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
        donations.push(newDonation);
    }
    
    renderDonationTable();
    closeModal('donationModal');
}

// 删除捐款
function deleteDonation(id) {
    if (confirm('确定要删除该捐款记录吗？')) {
        donations = donations.filter(d => d.id !== id);
        renderDonationTable();
    }
}

// 查看申请
function viewApplication(id) {
    const app = applications.find(a => a.id === id);
    if (!app) return;
    
    const typeText = app.type === 'partner' ? '商业合作申请' : '公益赞助申请';
    const statusText = app.status === 'processed' ? '已处理' : '待处理';
    
    alert(`${typeText}\n\n申请人: ${app.name}\n联系方式: ${app.contact}\n提交时间: ${app.time}\n状态: ${statusText}`);
}

// 处理申请
function processApplication(id) {
    const index = applications.findIndex(a => a.id === id);
    if (index !== -1) {
        applications[index].status = 'processed';
        renderApplicationTable();
    }
}

// 编辑广告
function editAd(id) {
    alert(`编辑广告位功能\n\n广告位 ID: ${id}\n\n此功能需要对接后端API实现`);
}

// 切换广告状态
function toggleAd(id) {
    const adCards = document.querySelectorAll('.ad-card');
    if (adCards[id - 1]) {
        const badge = adCards[id - 1].querySelector('.ad-badge');
        if (badge.classList.contains('active')) {
            badge.classList.remove('active');
            badge.classList.add('inactive');
            badge.textContent = '下线';
        } else {
            badge.classList.remove('inactive');
            badge.classList.add('active');
            badge.textContent = '在线';
        }
    }
}

// 显示通知
function showNotifications() {
    alert('通知中心\n\n📝 收到新的合作申请 - XX科技公司\n❤️ 爱心用户 张三 捐赠 ¥500\n📦 Shield Pro 产品页访问量突破1000');
}

// 切换暗色模式
function toggleDarkMode() {
    alert('暗色模式切换功能\n\n当前系统默认使用暗色主题，如需切换请修改CSS变量');
}

// 退出登录
function handleLogout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('isLoggedIn');
        sessionStorage.clear();
        window.location.href = 'login.html';
    }
}

// 数据看板刷新动画
function animateStats() {
    const stats = [
        { id: 'totalVisits', target: 12458 },
        { id: 'productInquiries', target: 238 },
        { id: 'totalDonations', target: 12580, prefix: '¥' },
        { id: 'partnerApplications', target: 56 }
    ];
    
    stats.forEach(stat => {
        const element = document.getElementById(stat.id);
        if (element) {
            let current = 0;
            const increment = stat.target / 50;
            const prefix = stat.prefix || '';
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= stat.target) {
                    current = stat.target;
                    clearInterval(timer);
                }
                element.textContent = prefix + Math.floor(current).toLocaleString();
            }, 30);
        }
    });
}

// 页面加载完成后执行动画
window.addEventListener('load', function() {
    setTimeout(animateStats, 500);
});
