const cloudbase = require("@cloudbase/node-sdk");

const app = cloudbase.init({
  env: process.env.TCB_ENV
});
const db = app.database();
const auth = app.auth();

/**
 * 登录验证 API
 * 管理员登录认证
 */
exports.main = async (event, context) => {
  try {
    const { httpMethod, path, queryString, body } = event;
    const query = queryString || {};
    const data = typeof body === 'string' ? JSON.parse(body) : data;

    console.log('请求:', { httpMethod, path, query, data });

    switch (httpMethod) {
      case 'POST':
        return await handlePost(data);
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
 * 管理员登录
 */
async function handlePost(data) {
  const { username, password } = data;

  if (!username || !password) {
    return {
      code: 400,
      message: '用户名和密码不能为空'
    };
  }

  // 查询管理员账户
  const res = await db
    .collection('admins')
    .where({ username })
    .get();

  if (res.data.length === 0) {
    return {
      code: 401,
      message: '用户名或密码错误'
    };
  }

  const admin = res.data[0];

  // 验证密码（实际项目中应该使用加密）
  if (admin.password !== password) {
    return {
      code: 401,
      message: '用户名或密码错误'
    };
  }

  // 生成 token（简化版，实际应该使用 JWT）
  const token = Buffer.from(`${admin._id}:${Date.now()}`).toString('base64');

  // 返回登录信息（不返回密码）
  const { password: _, ...adminInfo } = admin;

  return {
    code: 0,
    data: {
      token,
      user: adminInfo,
      expireTime: Date.now() + 24 * 60 * 60 * 1000 // 24小时过期
    },
    message: '登录成功'
  };
}

/**
 * 验证 token
 */
async function handleGet(query) {
  const { token } = query;

  if (!token) {
    return {
      code: 401,
      message: '未提供 token'
    };
  }

  try {
    // 解析 token
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [adminId] = decoded.split(':');

    // 查询管理员
    const res = await db
      .collection('admins')
      .doc(adminId)
      .get();

    if (!res.data) {
      return {
        code: 401,
        message: '无效的 token'
      };
    }

    return {
      code: 0,
      data: {
        valid: true,
        user: res.data
      },
      message: 'token 有效'
    };
  } catch (error) {
    return {
      code: 401,
      message: '无效的 token'
    };
  }
}
