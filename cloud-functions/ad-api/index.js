const cloudbase = require("@cloudbase/node-sdk");

const app = cloudbase.init({
  env: process.env.TCB_ENV
});
const db = app.database();
const _ = db.command;

/**
 * 广告位管理 API
 * 支持广告位状态管理
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
 * 获取广告位列表
 */
async function handleGet(query) {
  const { position, status } = query;

  let whereCondition = {};
  
  // 按位置筛选
  if (position) {
    whereCondition.position = position;
  }

  // 按状态筛选
  if (status) {
    whereCondition.status = status;
  }

  const res = await db
    .collection('ads')
    .where(whereCondition)
    .orderBy('order', 'asc')
    .get();

  return {
    code: 0,
    data: res.data,
    message: '获取成功'
  };
}

/**
 * 更新广告位
 */
async function handlePut(query, data) {
  const { id } = query;

  if (!id) {
    return {
      code: 400,
      message: '广告位 ID 不能为空'
    };
  }

  const updateData = {
    ...data,
    updatedAt: new Date().toISOString()
  };

  delete updateData.id;
  delete updateData.createdAt;
  delete updateData.position;

  const res = await db
    .collection('ads')
    .doc(id)
    .update(updateData);

  return {
    code: 0,
    data: res.data,
    message: '更新成功'
  };
}
