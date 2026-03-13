/**
 * CloudBase API 配置
 * 在生产环境中部署后，需要替换为实际的 CloudBase 环境信息
 */

const config = {
  // CloudBase 环境配置
  envId: '', // 填入你的 CloudBase 环境 ID
  region: 'ap-shanghai', // 地域，可选：ap-shanghai, ap-guangzhou, ap-beijing 等

  // 云函数 API 地址（部署后自动生成）
  apiBase: '', // 填入云函数访问地址，格式：https://<envId>.service.tcloudbase.com

  // 云函数名称
  functions: {
    productApi: 'product-api',
    charityApi: 'charity-api',
    adApi: 'ad-api',
    applicationApi: 'application-api',
    statsApi: 'stats-api',
    authApi: 'auth-api'
  },

  // 数据库配置
  database: {
    collections: {
      products: 'products',
      charities: 'charities',
      ads: 'ads',
      applications: 'applications',
      settings: 'settings',
      admins: 'admins'
    }
  },

  // 认证配置
  auth: {
    tokenKey: 'admin_token',
    tokenExpireTime: 24 * 60 * 60 * 1000 // 24小时
  },

  // 请求配置
  request: {
    timeout: 10000, // 10秒超时
    retryTimes: 3 // 失败重试次数
  }
};

// 环境检测
const isDev = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

/**
 * 获取 API 配置
 * @returns {Object} 配置对象
 */
function getApiConfig() {
  // 开发环境使用模拟数据
  if (isDev) {
    return {
      ...config,
      useMock: true
    };
  }

  // 生产环境使用实际 API
  if (!config.apiBase) {
    console.error('请先配置 CloudBase API 地址');
    alert('系统未配置，请联系管理员');
    return null;
  }

  return {
    ...config,
    useMock: false
  };
}

/**
 * 构建 API 请求 URL
 * @param {string} functionName 云函数名称
 * @param {Object} params 查询参数
 * @returns {string} 完整 URL
 */
function buildApiUrl(functionName, params = {}) {
  const apiConfig = getApiConfig();
  if (!apiConfig) return null;

  if (apiConfig.useMock) {
    return null; // 开发环境不使用真实 API
  }

  const baseUrl = `${apiConfig.apiBase}/${functionName}`;
  const queryString = new URLSearchParams(params).toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * 通用 API 请求方法
 * @param {string} functionName 云函数名称
 * @param {Object} options 请求选项
 * @returns {Promise} Promise 对象
 */
async function apiRequest(functionName, options = {}) {
  const apiConfig = getApiConfig();
  if (!apiConfig) return Promise.reject(new Error('API 配置错误'));

  const {
    method = 'GET',
    data = null,
    params = {},
    headers = {},
    needAuth = false
  } = options;

  // 开发环境使用模拟数据
  if (apiConfig.useMock) {
    return mockRequest(functionName, method, data);
  }

  // 生产环境使用真实 API
  let url = buildApiUrl(functionName, params);
  if (!url) return Promise.reject(new Error('API URL 构建失败'));

  // 添加认证 token
  if (needAuth) {
    const token = localStorage.getItem(config.auth.tokenKey);
    if (!token) {
      return Promise.reject(new Error('未登录'));
    }
    headers['Authorization'] = `Bearer ${token}`;
  }

  const requestOptions = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  if (data && method !== 'GET') {
    requestOptions.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, requestOptions);
    const result = await response.json();

    if (result.code !== 0) {
      throw new Error(result.message || '请求失败');
    }

    return result.data;
  } catch (error) {
    console.error('API 请求失败:', error);
    throw error;
  }
}

/**
 * 模拟请求数据（开发环境）
 */
async function mockRequest(functionName, method, data) {
  // 模拟延迟
  await new Promise(resolve => setTimeout(resolve, 300));

  // 根据不同的云函数返回模拟数据
  const mockData = {
    'product-api': mockProductData,
    'charity-api': mockCharityData,
    'ad-api': mockAdData,
    'application-api': mockApplicationData,
    'stats-api': mockStatsData,
    'auth-api': mockAuthData
  };

  const handler = mockData[functionName];
  if (handler) {
    return handler(method, data);
  }

  return null;
}

// 模拟数据生成函数
function mockProductData(method, data) {
  const products = [
    { _id: '1', name: 'Shield Pro 专业版', price: '2999', description: '企业级网络安全防护解决方案', image: '', status: 'online' },
    { _id: '2', name: 'Scanner 扫描版', price: '999', description: '快速安全漏洞扫描工具', image: '', status: 'online' }
  ];

  if (method === 'GET') return products;
  if (method === 'POST') return { _id: Date.now().toString(), ...data };
  if (method === 'PUT') return { ...data };
  return null;
}

function mockCharityData(method, data) {
  const charities = [
    { _id: '1', donor: '匿名捐赠者', amount: '5000', date: '2025-01-15', status: 'confirmed' },
    { _id: '2', donor: '张三', amount: '1000', date: '2025-01-20', status: 'confirmed' }
  ];

  if (method === 'GET') return charities;
  if (method === 'POST') return { _id: Date.now().toString(), ...data };
  return null;
}

function mockAdData(method, data) {
  const ads = [
    { _id: '1', position: 'left', imageUrl: '', link: '#', status: 'offline', order: 1 },
    { _id: '2', position: 'right', imageUrl: '', link: '#', status: 'offline', order: 1 }
  ];

  if (method === 'GET') return ads;
  return null;
}

function mockApplicationData(method, data) {
  const applications = [
    { _id: '1', type: 'cooperation', name: '李四', company: '科技有限公司', email: 'lisi@example.com', phone: '13800138000', status: 'pending' },
    { _id: '2', type: 'sponsorship', name: '王五', company: '', email: 'wangwu@example.com', phone: '13900139000', status: 'pending' }
  ];

  if (method === 'GET') return applications;
  return null;
}

function mockStatsData(method, data) {
  return {
    visits: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      visits: Math.floor(Math.random() * 500) + 100,
      uniqueVisitors: Math.floor(Math.random() * 300) + 50
    })),
    products: {
      total: 2,
      online: 2,
      offline: 0
    },
    charity: {
      totalAmount: '6000.00',
      donorCount: 2,
      confirmedCount: 2,
      pendingCount: 0,
      annualGoal: '100000.00',
      progress: '6.00'
    },
    applications: {
      total: 2,
      cooperation: 1,
      sponsorship: 1,
      pending: 2
    }
  };
}

function mockAuthData(method, data) {
  if (method === 'POST') {
    if (data.username === 'admin' && data.password === 'admin123') {
      return {
        token: 'mock_token_' + Date.now(),
        user: {
          _id: '1',
          username: 'admin',
          permissions: ['read', 'write', 'delete', 'admin']
        },
        expireTime: Date.now() + 24 * 60 * 60 * 1000
      };
    }
    throw new Error('用户名或密码错误');
  }
  return null;
}

// 导出配置和方法
window.apiConfig = config;
window.getApiConfig = getApiConfig;
window.apiRequest = apiRequest;
