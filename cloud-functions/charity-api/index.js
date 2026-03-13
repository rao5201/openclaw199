const cloudbase = require("@cloudbase/node-sdk");

const app = cloudbase.init({
  env: process.env.TCB_ENV
});
const db = app.database();
const _ = db.command;

/**
 * 公益管理 API
 * 支持捐款记录管理、统计数据
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
      case 'POST':
        return await handlePost(data);
      case 'PUT':
        return await handlePut(query, data);
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
 * 获取捐款记录或统计数据
 */
async function handleGet(query) {
  const { id, type, year } = query;

  // 获取单条记录
  if (id) {
    const res = await db
      .collection('charities')
      .doc(id)
      .get();

    return {
      code: 0,
      data: res.data
    };
  }

  // 获取统计数据
  if (type === 'stats') {
    return await getStats(year);
  }

  // 获取所有记录
  const collection = db.collection('charities');

  // 按年份筛选
  let whereCondition = {};
  if (year) {
    const startDate = new Date(`${year}-01-01`).toISOString();
    const endDate = new Date(`${year}-12-31`).toISOString();
    whereCondition = {
      date: _.gte(startDate).and(_.lte(endDate))
    };
  }

  const res = await collection
    .where(whereCondition)
    .orderBy('date', 'desc')
    .get();

  return {
    code: 0,
    data: res.data,
    message: '获取成功'
  };
}

/**
 * 获取统计数据
 */
async function getStats(year) {
  const currentYear = year || new Date().getFullYear();
  const startDate = new Date(`${currentYear}-01-01`).toISOString();
  const endDate = new Date(`${currentYear}-12-31`).toISOString();

  // 获取年度捐款总额
  const charityRes = await db
    .collection('charities')
    .where({
      date: _.gte(startDate).and(_.lte(endDate)),
      status: 'confirmed'
    })
    .get();

  const totalAmount = charityRes.data.reduce((sum, item) => {
    return sum + parseFloat(item.amount || 0);
  }, 0);

  // 获取年度目标
  const goalRes = await db
    .collection('settings')
    .where({ key: 'annualGoal' })
    .get();

  const annualGoal = goalRes.data.length > 0 ? parseFloat(goalRes.data[0].value) : 100000;

  // 获取捐款人数
  const donorCount = charityRes.data.length;

  // 按月统计
  const monthlyStats = {};
  charityRes.data.forEach(item => {
    const date = new Date(item.date);
    const month = date.getMonth() + 1;
    const monthKey = `${currentYear}-${month.toString().padStart(2, '0')}`;
    if (!monthlyStats[monthKey]) {
      monthlyStats[monthKey] = 0;
    }
    monthlyStats[monthKey] += parseFloat(item.amount || 0);
  });

  return {
    code: 0,
    data: {
      totalAmount: totalAmount.toFixed(2),
      annualGoal: annualGoal.toFixed(2),
      progress: ((totalAmount / annualGoal) * 100).toFixed(2),
      donorCount,
      monthlyStats
    },
    message: '获取成功'
  };
}

/**
 * 添加捐款记录
 */
async function handlePost(data) {
  if (!data.donor || !data.amount) {
    return {
      code: 400,
      message: '捐款人和金额不能为空'
    };
  }

  const record = {
    donor: data.donor,
    amount: parseFloat(data.amount),
    date: data.date || new Date().toISOString(),
    status: 'pending', // pending, confirmed, rejected
    message: data.message || '',
    createdAt: new Date().toISOString()
  };

  const res = await db
    .collection('charities')
    .add(record);

  return {
    code: 0,
    data: { id: res.id, ...record },
    message: '添加成功'
  };
}

/**
 * 更新捐款记录状态
 */
async function handlePut(query, data) {
  const { id } = query;

  if (!id) {
    return {
      code: 400,
      message: '记录 ID 不能为空'
    };
  }

  const res = await db
    .collection('charities')
    .doc(id)
    .update({
      status: data.status,
      updatedAt: new Date().toISOString()
    });

  return {
    code: 0,
    data: res.data,
    message: '更新成功'
  };
}
