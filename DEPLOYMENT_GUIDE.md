# 完整部署指南 - CloudBase + GitHub

## 📋 目录

1. [准备工作](#准备工作)
2. [CloudBase 环境配置](#cloudbase-环境配置)
3. [数据库初始化](#数据库初始化)
4. [云函数部署](#云函数部署)
5. [静态网站托管](#静态网站托管)
6. [GitHub 自动部署](#github-自动部署)
7. [前端配置](#前端配置)
8. [测试上线](#测试上线)
9. [常见问题](#常见问题)

---

## 准备工作

### 1. 账号注册

- 注册腾讯云账号：https://cloud.tencent.com/register
- 完成实名认证

### 2. 开通 CloudBase 服务

1. 登录腾讯云控制台
2. 搜索"CloudBase"或"云开发"
3. 点击"立即使用"
4. 选择"免费版"套餐（个人项目足够）

### 3. 获取 API 密钥

1. 进入 CloudBase 控制台
2. 点击右上角"设置" → "API 密钥"
3. 创建新密钥，记录：
   - 密钥 ID
   - 密钥内容

---

## CloudBase 环境配置

### 1. 创建环境

1. 进入 CloudBase 控制台
2. 点击"新建环境"
3. 填写信息：
   - 环境名称：`security-website`
   - 地域：选择离你最近的（如：华东-上海）
   - 套餐：免费版
4. 等待环境创建完成（约 1-2 分钟）

### 2. 获取环境信息

创建完成后，记录以下信息：
- **环境 ID**：格式如 `security-website-xxxxx`
- **环境域名**：格式如 `security-website-xxxxx.tcloudbase.com`

### 3. 开启服务

在环境设置中，开启以下服务：
- ✅ 云函数
- ✅ 数据库（NoSQL）
- ✅ 云存储
- ✅ 静态网站托管

---

## 数据库初始化

### 方法一：使用控制台导入（推荐）

1. 进入 CloudBase 控制台
2. 选择你的环境
3. 点击"数据库"
4. 点击"导入数据"
5. 上传 `database/init-database.json` 文件
6. 点击"确定"完成导入

### 方法二：使用云函数执行

1. 在控制台创建云函数 `init-database`
2. 将 `database/init-script.js` 内容复制到云函数
3. 部署云函数
4. 在控制台执行该云函数

### 验证数据

导入完成后，检查以下集合是否有数据：
- ✅ `admins` - 管理员账户
- ✅ `products` - 产品信息
- ✅ `charities` - 捐款记录
- ✅ `ads` - 广告位配置
- ✅ `applications` - 申请记录
- ✅ `settings` - 系统设置

---

## 云函数部署

### 方法一：使用 CloudBase CLI（推荐）

#### 1. 安装 CLI

```bash
npm install -g @cloudbase/cli
```

#### 2. 登录

```bash
cloudbase login --apiKeyId <你的密钥ID> --apiKey <你的密钥>
```

#### 3. 初始化项目

```bash
# 进入云函数目录
cd cloud-functions

# 初始化（可选，如果已有配置文件）
cloudbase init
```

#### 4. 修改配置

编辑 `cloudbaserc.json`，将 `"你的环境ID"` 替换为实际环境 ID：

```json
{
  "envId": "security-website-xxxxx",
  "region": "ap-shanghai"
}
```

#### 5. 部署云函数

```bash
# 部署所有云函数
cloudbase functions:deploy

# 部署单个云函数
cloudbase functions:deploy product-api
```

#### 6. 配置 HTTP 触发

在 CloudBase 控制台：
1. 进入云函数列表
2. 点击每个云函数
3. 点击"触发管理" → "创建触发器"
4. 选择"HTTP 触发器"
5. 记录触发器 URL（格式：`https://<envId>.service.tcloudbase.com/<function-name>`）

### 方法二：使用控制台上传

1. 进入 CloudBase 控制台
2. 点击"云函数"
3. 点击"新建"或"导入"
4. 为每个云函数：
   - 填写函数名（如 `product-api`）
   - 上传 `index.js` 和 `package.json`
   - 点击"确定"
5. 为每个云函数创建 HTTP 触发器

---

## 静态网站托管

### 1. 上传文件

#### 使用 CLI（推荐）

```bash
# 进入项目根目录
cd "C:\Users\Lenovo\Desktop\安全防护网站代码\网站后台文件夹"

# 部署静态网站
cloudbase hosting deploy . -e <环境ID>
```

#### 使用控制台

1. 进入 CloudBase 控制台
2. 点击"静态网站托管"
3. 点击"文件管理"
4. 上传以下文件：
   - `index.html`
   - `login.html`
   - `cloudbase-sdk.js`
   - `assets/` 目录下的所有文件

### 2. 配置域名

#### 使用默认域名（免费）

CloudBase 会自动分配域名，格式：
```
https://<envId>.tcb.qcloud.la
```

#### 绑定自定义域名（需要备案）

1. 在 CloudBase 控制台点击"域名管理"
2. 添加自定义域名
3. 按提示配置 DNS 解析
4. 等待 SSL 证书自动签发

---

## GitHub 自动部署

### 1. 推送代码到 GitHub

```bash
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 添加远程仓库
git remote add origin https://github.com/你的用户名/你的仓库名.git

# 推送
git branch -M main
git push -u origin main
```

### 2. 配置 GitHub Secrets

1. 进入 GitHub 仓库
2. 点击"Settings" → "Secrets and variables" → "Actions"
3. 点击"New repository secret"
4. 添加以下 Secrets：

| Secret 名称 | 说明 | 值 |
|-------------|------|-----|
| `TCB_KEY_ID` | CloudBase 密钥 ID | 从 CloudBase 控制台获取 |
| `TCB_KEY` | CloudBase 密钥内容 | 从 CloudBase 控制台获取 |
| `TCB_ENV_ID` | CloudBase 环境 ID | 如 `security-website-xxxxx` |

### 3. 启用 GitHub Actions

1. 进入仓库
2. 点击"Actions" 标签
3. 如果有提示，点击"I understand my workflows, go ahead and enable them"

### 4. 手动触发部署

1. 进入仓库
2. 点击"Actions" 标签
3. 选择"Deploy to CloudBase"
4. 点击"Run workflow"
5. 选择分支，点击"Run workflow"

### 5. 查看部署日志

1. 进入仓库
2. 点击"Actions" 标签
3. 点击最近的工作流
4. 查看每个步骤的执行日志

---

## 前端配置

### 1. 修改 API 配置

编辑 `assets/js/api-config.js`，填入实际配置：

```javascript
const config = {
  // CloudBase 环境配置
  envId: 'security-website-xxxxx', // 替换为实际环境 ID
  region: 'ap-shanghai',

  // 云函数 API 地址
  apiBase: 'https://security-website-xxxxx.service.tcloudbase.com',

  // ... 其他配置保持不变
};
```

### 2. 重新部署前端

修改配置后，重新执行部署命令：

```bash
cloudbase hosting deploy . -e security-website-xxxxx
```

或等待 GitHub Actions 自动部署（推送代码到 main 分支）。

---

## 测试上线

### 1. 访问网站

使用 CloudBase 分配的域名或自定义域名访问：

- 前台：`https://<域名>/index.html`
- 后台：`https://<域名>/login.html`

### 2. 测试登录

1. 打开登录页面
2. 输入：
   - 用户名：`admin`
   - 密码：`admin123`
3. 点击"登录"
4. 验证是否能正常进入后台

### 3. 测试功能

逐个测试以下功能：

**数据看板**
- ✅ 统计卡片数据是否显示
- ✅ 折线图是否加载

**产品管理**
- ✅ 产品列表是否显示
- ✅ 添加/编辑/删除产品
- ✅ 上架/下架状态切换

**公益管理**
- ✅ 捐款记录列表
- ✅ 年度目标进度
- ✅ 确认捐款

**广告位管理**
- ✅ 广告位列表
- ✅ 在线/下线切换

**申请管理**
- ✅ 申请记录列表
- ✅ 查看详情
- ✅ 处理申请

**系统设置**
- ✅ 系统信息编辑
- ✅ 年度目标设置

### 4. 检查数据库

在 CloudBase 控制台查看数据库：
- 数据是否正确写入
- 集合数量是否正确

### 5. 查看云函数日志

在 CloudBase 控制台：
1. 进入云函数列表
2. 点击任意云函数
3. 点击"日志"查看运行日志
4. 检查是否有错误

---

## 常见问题

### 1. 云函数部署失败

**问题**：部署时报错 "未授权"

**解决**：
```bash
# 重新登录
cloudbase logout
cloudbase login --apiKeyId <密钥ID> --apiKey <密钥>
```

### 2. 前端无法调用 API

**问题**：浏览器控制台显示跨域错误

**解决**：
1. 检查云函数 HTTP 触发器是否创建
2. 检查 `apiBase` 配置是否正确
3. 检查 CORS 配置（CloudBase 默认支持）

### 3. 数据库权限错误

**问题**：云函数报错 "权限不足"

**解决**：
1. 进入 CloudBase 控制台
2. 数据库 → 权限设置
3. 将权限设置为"所有用户可读写"（开发环境）
4. 或配置自定义安全规则

### 4. 静态网站无法访问

**问题**：访问域名显示 404

**解决**：
1. 检查文件是否上传成功
2. 检查 `index.html` 是否在根目录
3. 检查默认首页配置

### 5. GitHub Actions 失败

**问题**：Actions 工作流失败

**解决**：
1. 检查 Secrets 是否正确配置
2. 查看工作流日志定位具体错误
3. 检查网络连接
4. 手动触发测试

### 6. 免费额度超限

**问题**：CloudBase 提示额度不足

**解决**：
1. 进入 CloudBase 控制台
2. 查看"费用概览"
3. 按需升级套餐或优化使用量
4. 优化云函数执行时间
5. 减少不必要的数据库查询

---

## 📞 技术支持

### 官方文档

- [CloudBase 文档](https://docs.cloudbase.net/)
- [CloudBase SDK 文档](https://docs.cloudbase.net/api-reference/web.html)
- [GitHub Actions 文档](https://docs.github.com/cn/actions)

### 常用命令

```bash
# CloudBase CLI
cloudbase --help              # 查看帮助
cloudbase functions:list       # 列出云函数
cloudbase functions:deploy     # 部署云函数
cloudbase hosting:deploy      # 部署静态网站
cloudbase hosting:list        # 列出部署记录

# Git 命令
git status                    # 查看状态
git add .                     # 添加文件
git commit -m "说明"          # 提交
git push                      # 推送
```

---

## 🎉 完成部署

恭喜！您的网站和后台管理系统已经成功上线！

### 后续维护建议

1. **定期备份数据**
   - 每周导出数据库
   - 保存到本地或云存储

2. **监控资源使用**
   - 定期查看 CloudBase 费用概览
   - 优化云函数执行时间

3. **更新代码**
   - 修改后推送到 GitHub
   - 自动触发部署

4. **安全加固**
   - 定期修改管理员密码
   - 配置数据库访问权限
   - 启用 HTTPS（默认开启）

---

**祝您的项目运行顺利！** 🚀
