# 后台管理系统生产环境部署方案

## 📋 部署架构总览

```
GitHub 仓库
    ├── website/              # 前台网站
    │   ├── index.html
    │   ├── index6.html
    │   └── assets/
    └── admin/                # 后台管理系统
        ├── index.html
        ├── login.html
        └── assets/
             
CloudBase 环境
    ├── 静态网站托管          # 部署前后台
    ├── 云函数 (API)          # 后端接口
    ├── NoSQL 数据库         # 存储数据
    ├── 云存储               # 存储图片
    └── 身份认证             # 登录验证
```

## 🎯 部署目标

1. **前后台统一托管**：使用 CloudBase 静态网站托管
2. **API 接口**：使用云函数提供 RESTful API
3. **数据存储**：使用 NoSQL 数据库存储所有数据
4. **身份认证**：使用 CloudBase Auth 管理登录
5. **CI/CD**：通过 GitHub Actions 自动部署

## 📦 技术栈

- **前端**：纯 HTML/CSS/JavaScript
- **后端**：Node.js 云函数
- **数据库**：CloudBase NoSQL（文档型数据库）
- **存储**：CloudBase 云存储
- **认证**：CloudBase Auth
- **托管**：CloudBase 静态网站托管

## 🔑 CloudBase 功能映射

### 云函数 API 端点

| 功能 | 云函数名 | HTTP 方法 | 说明 |
|------|---------|-----------|------|
| 产品管理 | product-api | GET/POST/PUT/DELETE | 产品 CRUD |
| 公益管理 | charity-api | GET/POST/PUT | 捐款记录管理 |
| 广告位管理 | ad-api | GET/PUT | 广告位状态管理 |
| 申请管理 | application-api | GET/PUT | 申请记录处理 |
| 数据统计 | stats-api | GET | 看板数据统计 |
| 登录验证 | auth-api | POST | 管理员登录 |

### 数据库集合设计

| 集合名 | 字段 | 说明 |
|--------|------|------|
| products | {id, name, price, description, image, status, createdAt} | 产品信息 |
| charities | {id, donor, amount, date, status, message} | 捐款记录 |
| ads | {position, imageUrl, link, status, order} | 广告位配置 |
| applications | {id, type, name, company, email, phone, content, status, createdAt} | 申请记录 |
| settings | {key, value, updatedAt} | 系统设置 |
| admins | {username, password, permissions} | 管理员账户 |

## 🚀 部署步骤概览

### 第一阶段：CloudBase 环境准备
1. 注册腾讯云账号
2. 开通 CloudBase 服务
3. 创建环境（免费版）
4. 获取环境 ID 和密钥

### 第二阶段：数据库初始化
1. 创建数据库集合
2. 导入初始数据
3. 配置数据库权限

### 第三阶段：云函数开发
1. 创建 6 个云函数
2. 部署云函数代码
3. 测试 API 接口

### 第四阶段：前端改造
1. 集成 CloudBase SDK
2. 替换本地存储为 API 调用
3. 配置环境变量

### 第五阶段：GitHub 自动部署
1. 配置 GitHub Actions
2. 设置 CloudBase CLI
3. 实现自动部署

### 第六阶段：上线发布
1. 绑定自定义域名（可选）
2. 配置 SSL 证书
3. 监控和日志

## 📝 前后端改造说明

### 当前状态（开发环境）
- 数据存储：`localStorage` + 内存
- 登录验证：硬编码（admin/admin123）
- API 调用：无（纯前端）

### 目标状态（生产环境）
- 数据存储：CloudBase NoSQL 数据库
- 登录验证：CloudBase Auth
- API 调用：云函数 RESTful API

### 需要改造的文件

1. **admin.js**
   - 替换 `localStorage` 为 API 调用
   - 集成 CloudBase SDK
   - 处理异步请求和错误

2. **login.js**
   - 使用 CloudBase Auth 登录
   - 获取真实用户信息

3. **新增配置文件**
   - `config.js`：环境配置
   - `cloudbase-sdk.js`：SDK 集成

## 💰 成本估算

### CloudBase 免费额度
- **静态网站托管**：5GB 存储 + 5GB/月 流量
- **云函数**：4 万次调用/月 + 40万 GBs/月
- **数据库**：2GB 存储 + 5 万次读/日 + 3 万次写/日
- **云存储**：5GB 存储 + 5GB/月 下行流量
- **CDN**：10GB/月 流量

### 评估
对于个人或小型项目，免费额度完全够用，**无需付费**。

## ⚠️ 注意事项

1. **安全性**
   - 不要在前端暴露云函数密钥
   - 使用环境变量管理敏感信息
   - 配合 CloudBase Auth 进行权限控制

2. **性能优化**
   - 开启 CDN 加速
   - 图片使用 WebP 格式
   - 合理设置缓存策略

3. **数据备份**
   - 定期导出数据库
   - 使用 CloudBase 备份功能

4. **监控告警**
   - 配置云函数监控
   - 设置错误日志告警

## 📚 参考文档

- [CloudBase 官方文档](https://docs.cloudbase.net/)
- [CloudBase SDK](https://docs.cloudbase.net/api-reference/web.html)
- [CloudBase CLI](https://docs.cloudbase.net/cli-v1/introduce.html)
- [GitHub Actions](https://docs.github.com/cn/actions)

## 🎉 预期效果

部署完成后，您将拥有：

✅ 线上可访问的前台网站  
✅ 线上可访问的后台管理系统  
✅ 持久化的数据存储  
✅ 安全的用户登录  
✅ 完整的 API 接口  
✅ 自动化部署流程  
✅ 免费使用（个人项目）  

---

**下一步**：我将为您创建具体的代码文件和配置。
