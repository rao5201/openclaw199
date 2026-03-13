# 🛡️ OpenClaw 安全防护网站 - 后台管理系统

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![CloudBase](https://img.shields.io/badge/CloudBase-Node.js-green.svg)
![Deployment](https://img.shields.io/badge/deploy-GitHub%20Actions-orange.svg)

一个完整的安全防护网站后台管理系统，基于 CloudBase 无服务器架构部署。

## ✨ 特性

### 后台管理系统
- 🔐 **安全登录** - 基于 CloudBase Auth 的身份验证
- 📊 **数据看板** - 实时统计和可视化图表
- 📦 **产品管理** - 产品的增删改查和上下架
- ❤️ **公益管理** - 捐款记录管理和年度目标追踪
- 📢 **广告位管理** - 侧边和底部广告位配置
- 📝 **申请管理** - 商业合作和赞助申请处理
- ⚙️ **系统设置** - 网站信息和管理员配置

### 技术架构
- 🌐 **纯前端** - HTML/CSS/JavaScript，无需框架
- ☁️ **CloudBase** - 无服务器架构，完全免费
- 🚀 **云函数** - 6个 RESTful API 接口
- 🗄️ **NoSQL 数据库** - CloudBase 文档数据库
- 🔄 **自动部署** - GitHub Actions 持续集成
- 📱 **响应式** - 支持桌面、平板、移动端

## 📁 项目结构

```
网站后台文件夹/
├── assets/                    # 前端资源
│   ├── css/
│   │   ├── admin.css          # 管理页面样式
│   │   └── login.css          # 登录页面样式
│   └── js/
│       ├── admin.js           # 管理功能脚本
│       ├── login.js           # 登录功能脚本
│       └── api-config.js       # API 配置和封装
├── cloud-functions/           # 云函数 API
│   ├── product-api/           # 产品管理
│   ├── charity-api/           # 公益管理
│   ├── ad-api/                # 广告位管理
│   ├── application-api/       # 申请管理
│   ├── stats-api/             # 数据统计
│   └── auth-api/              # 登录验证
├── database/                  # 数据库
│   ├── init-database.json     # 初始数据
│   └── init-script.js         # 初始化脚本
├── .github/                   # GitHub 配置
│   └── workflows/
│       └── deploy.yml         # 自动部署
├── index.html                 # 主管理页面
├── login.html                 # 登录页面
├── cloudbase-sdk.js           # CloudBase SDK
├── cloudbaserc.json           # CloudBase 配置
├── DEPLOYMENT_QUICKSTART.md   # 快速开始指南 ⭐
├── DEPLOYMENT_GUIDE.md        # 完整部署指南
└── README.md                  # 本文档
```

## 🚀 快速开始

### 方式一：使用 CloudBase 控制台（推荐新手）

**总用时：约 20 分钟**

1. **注册 CloudBase**
   - 访问：https://cloud.tencent.com/
   - 开通 CloudBase 免费版
   - 创建环境，记录**环境 ID**

2. **初始化数据库**
   - 进入 CloudBase 控制台 → "数据库"
   - 上传 `database/init-database.json`

3. **部署云函数**
   - 进入 CloudBase 控制台 → "云函数"
   - 创建 6 个云函数（`cloud-functions/` 目录下）
   - 为每个云函数创建 HTTP 触发器

4. **部署静态网站**
   - 进入 CloudBase 控制台 → "静态网站托管"
   - 上传 `index.html`, `login.html`, `cloudbase-sdk.js`, `assets/` 目录

5. **配置前端**
   - 修改 `assets/js/api-config.js`
   - 填入环境 ID 和 API 地址
   - 重新上传配置文件

**访问网站：** `https://<环境ID>.tcb.qcloud.la`

### 方式二：使用 GitHub Actions（推荐开发者）

1. **准备 CloudBase 环境**（同方式一）

2. **配置 GitHub Secrets**
   - 进入仓库 Settings → Secrets
   - 添加 `TCB_KEY_ID`, `TCB_KEY`, `TCB_ENV_ID`

3. **自动部署**
   - 推送代码到 `main` 分支
   - 自动触发部署

## 📖 详细文档

| 文档 | 说明 |
|------|------|
| [快速开始指南](./DEPLOYMENT_QUICKSTART.md) | 3步快速上线（5分钟阅读） |
| [完整部署指南](./DEPLOYMENT_GUIDE.md) | 详细步骤和问题排查（30分钟） |
| [部署方案设计](./DEPLOYMENT_PLAN.md) | 架构设计和技术选型 |

## 🔑 默认账户

**管理员登录信息：**
- 用户名：`admin`
- 密码：`admin123`

> ⚠️ **安全提醒**：部署成功后请立即修改默认密码！

## 💰 成本说明

### CloudBase 免费额度

| 资源 | 免费额度 |
|------|---------|
| 静态网站托管 | 5GB 存储 + 5GB/月 流量 |
| 云函数 | 4 万次调用/月 + 40万 GBs/月 |
| NoSQL 数据库 | 2GB 存储 + 5 万次读/日 + 3 万次写/日 |
| 云存储 | 5GB 存储 + 5GB/月 下行流量 |
| CDN | 10GB/月 流量 |

**结论：** 个人或小型项目完全免费！

## 🌟 云函数 API

### API 端点

| 云函数 | 功能 | HTTP 方法 | 说明 |
|--------|------|-----------|------|
| `product-api` | 产品管理 | GET/POST/PUT/DELETE | 产品 CRUD |
| `charity-api` | 公益管理 | GET/POST/PUT | 捐款记录和统计 |
| `ad-api` | 广告位管理 | GET/PUT | 广告位状态 |
| `application-api` | 申请管理 | GET/POST/PUT | 申请处理 |
| `stats-api` | 数据统计 | GET | 看板数据 |
| `auth-api` | 登录验证 | GET/POST | 管理员登录 |

### 数据库集合

- `products` - 产品信息
- `charities` - 公益捐款记录
- `ads` - 广告位配置
- `applications` - 申请记录
- `settings` - 系统设置
- `admins` - 管理员账户

## 🛠️ 本地开发

### 环境要求

- Node.js 16.x 或更高版本
- 现代浏览器（Chrome, Edge, Firefox）

### 开发模式

1. 克隆仓库：
```bash
git clone https://github.com/rao5201/openclaw199.git
cd openclaw199
```

2. 直接打开 `login.html` 或 `index.html` 即可使用（开发模式使用模拟数据）

3. 修改代码后，推送到 GitHub 自动部署

## 📝 配置说明

### 1. CloudBase 环境配置

编辑 `cloudbaserc.json`：

```json
{
  "envId": "security-website-xxxxx",  // 替换为实际环境 ID
  "region": "ap-shanghai"             // 地域
}
```

### 2. 前端 API 配置

编辑 `assets/js/api-config.js`：

```javascript
const config = {
  envId: 'security-website-xxxxx',
  apiBase: 'https://security-website-xxxxx.service.tcloudbase.com',
  // ...
};
```

## 🔧 常见问题

### Q: 部署失败怎么办？

A: 查看详细部署指南中的"常见问题"章节：[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### Q: 如何修改管理员密码？

A: 在 CloudBase 控制台的数据库中，找到 `admins` 集合，修改 `password` 字段

### Q: 如何绑定自定义域名？

A: 在 CloudBase 控制台的"静态网站托管"中添加域名（需要备案）

### Q: 免费额度用完了怎么办？

A: 进入 CloudBase 控制台查看费用概览，按需升级套餐

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 📞 支持

- **CloudBase 文档**：https://docs.cloudbase.net/
- **GitHub Actions 文档**：https://docs.github.com/cn/actions
- **问题反馈**：提交 Issue

---

**祝您使用愉快！** 🎉
