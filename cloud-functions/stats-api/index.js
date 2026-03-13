const cloudbase = require("@cloudbase/node-sdk");

const app = cloudbase.init({
  env: process.env.TCB_ENV
});
const db = app.database();
const _ = db.command;

/**
 * 数据统计 API
 * 提供看板数据统计
 */
exports.main = async (event, context) => {
  try {
    const { httpMethod, path, queryString, body } = event;
    const query = queryString || {};
    const data = typeof body === 'string' ? JSON.parse(body) : data;

    console.log('请求:', { httpMethod, path, query, data });

    switch (httpMethod) {
      case 'GET':
        return await handleGet(query);
      default:
        return {
          code: 405,
          message: '不支持的 HTTP 方法'
        };
    }
  } catch (error) {
    console.error('错误:', error);
    return {
      code: 500,
      message: '服务器错误',
      error: error.message
    };
  }
};

/**
 * 获取统计数据
 */
async function handleGet(query) {
  const { type, days } = query;
  const daysNum = parseInt(days) || 7;

  // 获取所有统计数据
  const stats = {};

  // 1. 访问量统计（模拟数据，实际需要接入统计服务）
  stats.visits = await getVisitStats(daysNum);

  // 2. 产品咨询统计
  stats.products = await getProductStats();

  // 3. 公益捐款统计
  stats.charity = await getCharityStats();

  // 4. 合作申请统计
  stats.applications = await getApplicationStats();

  return {
    code: 0,
    data: stats,
    message: '获取成功'
  };
}

/**
 * 访问量统计
 */
async function getVisitStats(days) {
  // 实际项目中应该接入真实的统计服务（如百度统计、Google Analytics）
  // 这里返回模拟数据
  const stats = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    stats.push({
      date: dateStr,
      visits: Math.floor(Math.random() * 500) + 100, // 100-600
      uniqueVisitors: Math.floor(Math.random() * 300) + 50
    });
  }

  return stats;
}

/**
 * 产品统计
 */
async function getProductStats() {
  const res = await db
    .collection('products')
    .get();

  const total = res.data.length;
  const online = res.data.filter(p => p.status === 'online').length;
  const offline = res.data.filter(p => p.status === 'offline').length;

  return {
    total,
    online,
    offline,
    recentAdded: res.data.slice(0, 5).map(p => ({
      id: p._id,
      name: p.name,
      createdAt: p.createdAt
    }))
  };
}

/**
 * 公益捐款统计
 */
async function getCharityStats() {
  const currentYear = new Date().getFullYear();
  const startDate = new Date(`${currentYear}-01-01`).toISOString();
  const endDate = new Date(`${currentYear}-12-31`).toISOString();

  const res = await db
    .collection('charities')
    .where({
      date: _.gte(startDate).and(_.lte(endDate))
    })
    .get();

  const totalAmount = res.data.reduce((sum, item) => {
    return sum + parseFloat(item.amount || 0);
  }, 0);

  const confirmedCount = res.data.filter(c => c.status === 'confirmed').length;
  const pendingCount = res.data.filter(c => c.status === 'pending').length;

  // 获取年度目标
  const goalRes = await db
    .collection('settings')
    .where({ key: 'annualGoal' })
    .get();

  const annualGoal = goalRes.data.length > 0 ? parseFloat(goalRes.data[0].value) : 100000;

  return {
    totalAmount: totalAmount.toFixed(2),
    donorCount: res.data.length,
    confirmedCount,
    pendingCount,
    annualGoal: annualGoal.toFixed(2),
    progress: ((totalAmount / annualGoal) * 100).toFixed(2),
    recentDonations: res.data.slice(0, 5).map(c => ({
      id: c._id,
      donor: c.donor,
      amount: c.amount,
      date: c.date
    }))
  };
}

/**
 * 申请统计
 */
async function getApplicationStats() {
  const res = await db
    .collection('applications')
    .get();

  const total = res.data.length;
  const cooperation = res.data.filter(a => a.type === 'cooperation').length;
  const sponsorship = res.data.filter(a => a.type === 'sponsorship').length;
  const pending = res.data.filter(a => a.status === 'pending').length;
  const approved = res.data.filter(a => a.status === 'approved').length;
  const rejected = res.data.filter(a => a.status === 'rejected').length;

  return {
    total,
    cooperation,
    sponsorship,
    pending,
    approved,
    rejected,
    recentApplications: res.data.slice(0, 5).map(a => ({
      id: a._id,
      type: a.type,
      name: a.name,
      company: a.company,
      status: a.status,
      createdAt: a.createdAt
    }))
  };
}
