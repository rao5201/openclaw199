/**
 * 数据库初始化脚本
 * 用于在 CloudBase 控制台中执行
 */

// 导入初始化数据
const initData = require('./init-database.json');

/**
 * 执行数据库初始化
 * 使用方法：
 * 1. 在 CloudBase 控制台 -> 云开发 -> 数据库 -> 导入数据
 * 2. 选择 init-database.json 文件
 * 3. 或者使用 cloudbase init && cloudbase functions:deploy 部署后执行此脚本
 */

// 如果在云函数中运行
exports.main = async (event, context) => {
  const app = require('@cloudbase/node-sdk').init({
    env: process.env.TCB_ENV
  });
  const db = app.database();

  const results = {
    success: [],
    failed: []
  };

  try {
    // 遍历所有集合
    for (const collection of initData.collections) {
      try {
        // 创建集合（如果不存在）
        await db.createCollection(collection.name);
        results.success.push(`创建集合: ${collection.name}`);

        // 创建索引
        if (collection.indexes) {
          for (const index of collection.indexes) {
            try {
              await db.createIndex(collection.name, index);
              results.success.push(`创建索引: ${collection.name}.${index.name}`);
            } catch (e) {
              // 索引可能已存在，忽略错误
              results.success.push(`索引已存在: ${collection.name}.${index.name}`);
            }
          }
        }
      } catch (e) {
        results.failed.push(`创建集合失败: ${collection.name} - ${e.message}`);
      }
    }

    // 导入初始数据
    for (const [collectionName, data] of Object.entries(initData.initialData)) {
      try {
        if (Array.isArray(data) && data.length > 0) {
          for (const item of data) {
            await db.collection(collectionName).add(item);
          }
          results.success.push(`导入数据: ${collectionName} (${data.length} 条)`);
        }
      } catch (e) {
        results.failed.push(`导入数据失败: ${collectionName} - ${e.message}`);
      }
    }

    return {
      code: 0,
      message: '数据库初始化完成',
      data: results
    };
  } catch (error) {
    return {
      code: 500,
      message: '数据库初始化失败',
      error: error.message
    };
  }
};

// 如果在 Node.js 环境中运行
if (require.main === module) {
  console.log('请将此脚本部署为云函数后运行，或使用 CloudBase 控制台导入数据');
}
