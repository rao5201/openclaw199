const cloudbase = require("@cloudbase/node-sdk");

// 初始化 CloudBase
const app = cloudbase.init({
  env: process.env.TCB_ENV
});
const db = app.database();
const _ = db.command;

/**
 * 产品管理 API
 * 支持增删改查操作
 */
exports.main = async (event, context) => {
  try {
    const { httpMethod, path, queryString, body } = event;
    const query = queryString || {};
    const data = typeof body === 'string' ? JSON.parse(body) : body;

    console.log('请求:', { httpMethod, path, query, data });

    // 路由分发
    switch (httpMethod) {
      case 'GET':
        return await handleGet(query);
      case 'POST':
        return await handlePost(data);
      case 'PUT':
        return await handlePut(query, data);
      case 'DELETE':
        return await handleDelete(query);
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
 * 获取产品列表
 */
async function handleGet(query) {
  const { id } = query;

  // 获取单个产品
  if (id) {
    const res = await db
      .collection('products')
      .doc(id)
      .get();

    if (!res.data) {
      return {
        code: 404,
        message: '产品不存在'
      };
    }

    return {
      code: 0,
      data: res.data
    };
  }

  // 获取所有产品
  const res = await db
    .collection('products')
    .orderBy('createdAt', 'desc')
    .get();

  return {
    code: 0,
    data: res.data,
    message: '获取成功'
  };
}

/**
 * 添加产品
 */
async function handlePost(data) {
  // 验证必填字段
  if (!data.name || !data.price) {
    return {
      code: 400,
      message: '产品名称和价格不能为空'
    };
  }

  const product = {
    name: data.name,
    price: data.price,
    description: data.description || '',
    image: data.image || '',
    status: data.status || 'online',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const res = await db
    .collection('products')
    .add(product);

  return {
    code: 0,
    data: { id: res.id, ...product },
    message: '添加成功'
  };
}

/**
 * 更新产品
 */
async function handlePut(query, data) {
  const { id } = query;

  if (!id) {
    return {
      code: 400,
      message: '产品 ID 不能为空'
    };
  }

  const updateData = {
    ...data,
    updatedAt: new Date().toISOString()
  };

  // 移除不需要更新的字段
  delete updateData.id;
  delete updateData.createdAt;

  const res = await db
    .collection('products')
    .doc(id)
    .update(updateData);

  return {
    code: 0,
    data: res.data,
    message: '更新成功'
  };
}

/**
 * 删除产品
 */
async function handleDelete(query) {
  const { id } = query;

  if (!id) {
    return {
      code: 400,
      message: '产品 ID 不能为空'
    };
  }

  await db
    .collection('products')
    .doc(id)
    .remove();

  return {
    code: 0,
    message: '删除成功'
  };
}
