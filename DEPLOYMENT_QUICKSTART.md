# 快速开始 - 3步上线

## 第一步：CloudBase 环境准备（5分钟）

1. **注册腾讯云账号**
   - 访问：https://cloud.tencent.com/register
   - 完成实名认证

2. **开通 CloudBase**
   - 搜索"CloudBase"或"云开发"
   - 点击"立即使用" → 选择"免费版"

3. **创建环境**
   - 点击"新建环境"
   - 环境名称：`security-website`
   - 地域：选择离你最近的
   - 等待创建完成

4. **获取信息**
   - 记录**环境 ID**（格式：`security-website-xxxxx`）
   - 进入"设置" → "API 密钥" → 创建密钥
   - 记录**密钥 ID** 和**密钥内容**

---

## 第二步：部署后端服务（10分钟）

### 方式一：使用 CloudBase 控制台（最简单）

#### 部署数据库

1. 进入 CloudBase 控制台 → "数据库"
2. 点击"导入数据"
3. 上传 `database/init-database.json` 文件
4. 完成！

#### 部署云函数

1. 进入 CloudBase 控制台 → "云函数"
2. 为以下每个云函数创建：
   - `product-api` - 上传 `cloud-functions/product-api/` 目录
   - `charity-api` - 上传 `cloud-functions/charity-api/` 目录
   - `ad-api` - 上传 `cloud-functions/ad-api/` 目录
   - `application-api` - 上传 `cloud-functions/application-api/` 目录
   - `stats-api` - 上传 `cloud-functions/stats-api/` 目录
   - `auth-api` - 上传 `cloud-functions/auth-api/` 目录

3. 为每个云函数创建 HTTP 触发器
4. 完成！

### 方式二：使用 CLI（适合开发者）

```bash
# 1. 安装 CLI
npm install -g @cloudbase/cli

# 2. 登录（替换密钥信息）
cloudbase login --apiKeyId <密钥ID> --apiKey <密钥内容>

# 3. 修改配置
# 编辑 cloud-functions/cloudbaserc.json，将 envId 改为实际环境 ID

# 4. 部署所有云函数
cd cloud-functions
cloudbase functions:deploy

# 5. 创建 HTTP 触发器（在控制台操作）
```

---

## 第三步：部署前端网站（5分钟）

### 方式一：使用 CloudBase 控制台（最简单）

1. 进入 CloudBase 控制台 → "静态网站托管"
2. 点击"文件管理"
3. 上传以下文件：
   - `index.html`
   - `login.html`
   - `cloudbase-sdk.js`
   - `assets/` 目录（所有子文件和子目录）
4. 完成！

访问网站：`https://<环境ID>.tcb.qcloud.la`

### 方式二：使用 CLI（适合开发者）

```bash
# 1. 修改前端配置
# 编辑 assets/js/api-config.js，填入环境 ID 和 API 地址

# 2. 部署静态网站
cloudbase hosting deploy . -e <环境ID>

# 完成！
```

---

## 可选：GitHub 自动部署

### 1. 推送到 GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin main
```

### 2. 配置 Secrets

进入 GitHub 仓库 → Settings → Secrets → 添加：

| Name | Value |
|-------|-------|
| `TCB_KEY_ID` | CloudBase 密钥 ID |
| `TCB_KEY` | CloudBase 密钥内容 |
| `TCB_ENV_ID` | CloudBase 环境 ID |

### 3. 自动部署

推送到 `main` 分支会自动触发部署！

---

## 测试网站

### 访问地址

使用 CloudBase 提供的域名或自定义域名访问：

- 前台：`https://<环境ID>.tcb.qcloud.la`
- 后台：`https://<环境ID>.tcb.qcloud.la/login.html`

### 登录信息

- 用户名：`admin`
- 密码：`admin123`

---

## 常见问题快速解决

### ❓ 部署失败

**问题**：云函数上传失败

**解决**：检查文件格式，确保是 `index.js` + `package.json`

**问题**：数据库导入失败

**解决**：检查 `init-database.json` 格式是否正确

### ❓ 前端无法访问

**问题**：404 错误

**解决**：确保 `index.html` 在根目录

**问题**：API 调用失败

**解决**：检查 `api-config.js` 中的 `envId` 和 `apiBase` 配置

### ❓ 登录失败

**问题**：提示用户名或密码错误

**解决**：
1. 检查数据库 `admins` 集合
2. 确认默认账户是否存在
3. 重置密码：在控制台直接修改

---

## 下一步

详细部署步骤和问题排查，请查看：

📖 [完整部署指南](./DEPLOYMENT_GUIDE.md)

---

**恭喜完成部署！** 🎉

现在您的网站已经上线，可以开始使用了！
