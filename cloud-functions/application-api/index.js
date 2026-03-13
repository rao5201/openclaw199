const cloudbase = require("@cloudbase/node-sdk");

const app = cloudbase.init({
  env: process.env.TCB_ENV
});
const db = app.database();
const _ = db.command;

/**
 * 申请管理 API
 * 支持合作申请、赞助申请管理
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
 * 获取申请列表
 */
async function handleGet(query) {
  const { id, type, status } = query;

  // 获取单个申请
  if (id) {
    const res = await db
      .collection('applications')
      .doc(id)
      .get();

    if (!res.data) {
      return {
        code: 404,
        message: '申请不存在'
      };
    }

    return {
      code: 0,
      data: res.data
    };
  }

  // 获取所有申请
  let whereCondition = {};

  // 按类型筛选
  if (type) {
    whereCondition.type = type;
  }

  // 按状态筛选
  if (status) {
    whereCondition.status = status;
  }

  const res = await db
    .collection('applications')
    .where(whereCondition)
    .orderBy('createdAt', 'desc')
    .get();

  return {
    code: 0,
    data: res.data,
    message: '获取成功'
  };
}

/**
 * 添加申请
 */
async function handlePost(data) {
  // 验证必填字段
  if (!data.name || !data.email || !data.phone) {
    return {
      code: 400,
      message: '姓名、邮箱和电话不能为空'
    };
  }

  const application = {
    type: data.type || 'cooperation', // cooperation, sponsorship
    name: data.name,
    company: data.company || '',
    email: data.email,
    phone: data.phone,
    content: data.content || '',
    status: 'pending', // pending, approved, rejected
    createdAt: new Date().toISOString()
  };

  const res = await db
    .collection('applications')
    .add(application);

  return {
    code: 0,
    data: { id: res.id, ...application },
    message: '提交成功'
  };
}

/**
 * 更新申请状态
 */
async function handlePut(query, data) {
  const { id } = query;

  if (!id) {
    return {
      code: 400,
      message: '申请 ID 不能为空'
    };
  }

  const updateData = {
    status: data.status,
    updatedAt: new Date().toISOString()
  };

  const res = await db
    .collection('applications')
    .doc(id)
    .update(updateData);

  return {
    code: 0,
    data: res.data,
    message: '更新成功'
  };
}
