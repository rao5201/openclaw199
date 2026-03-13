# GitHub Actions 自动部署配置检查清单

使用此检查清单确保所有配置正确完成。

---

## ✅ 配置前准备

### 1. 腾讯云账号

- [ ] 已注册腾讯云账号：https://cloud.tencent.com/
- [ ] 已开通 CloudBase 服务
- [ ] 已创建 CloudBase 环境
- [ ] 环境状态为"运行中"

### 2. GitHub 仓库

- [ ] 代码已推送到 GitHub：https://github.com/rao5201/openclaw199
- [ ] 仓库是公开的（私有仓库也可以，但需注意权限）
- [ ] GitHub Actions 已启用（默认启用）

---

## 🔑 获取 CloudBase 凭证

### 环境 ID (TCB_ENV_ID)

- [ ] 已在 CloudBase 控制台找到环境 ID
- [ ] 环境 ID 格式正确（如：`openclaw-7g2j3k4l5m`）
- [ ] 已复制并保存环境 ID

**获取方式：**
1. 访问：https://console.cloud.tencent.com/tcb
2. 选择您的环境
3. 在概览页面查看环境 ID

---

### 访问密钥

#### 方法一：云函数密钥（推荐）

- [ ] 已在云函数页面找到"函数设置"
- [ ] 已添加访问密钥
- [ ] 已保存 Key ID（如：`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`）
- [ ] 已保存 Key Content（长字符串）

#### 方法二：环境密钥

- [ ] 已在环境设置找到"环境密钥"
- [ ] 已创建或获取密钥
- [ ] 已保存密钥 ID
- [ ] 已保存密钥内容

---

## 🔧 配置 GitHub Secrets

访问：https://github.com/rao5201/openclaw199/settings/secrets/actions

### Secret 1: TCB_ENV_ID

- [ ] 已点击 "New repository secret"
- [ ] Name 输入：`TCB_ENV_ID`
- [ ] Value 输入：您的环境 ID
- [ ] 已点击 "Add secret"
- [ ] Secrets 列表中已显示 `TCB_ENV_ID`

### Secret 2: TCB_KEY_ID

- [ ] 已点击 "New repository secret"
- [ ] Name 输入：`TCB_KEY_ID`
- [ ] Value 输入：您的密钥 ID
- [ ] 已点击 "Add secret"
- [ ] Secrets 列表中已显示 `TCB_KEY_ID`

### Secret 3: TCB_KEY

- [ ] 已点击 "New repository secret"
- [ ] Name 输入：`TCB_KEY`
- [ ] Value 输入：您的密钥内容（长字符串）
- [ ] 已点击 "Add secret"
- [ ] Secrets 列表中已显示 `TCB_KEY`

---

## ✨ 验证 Secrets 配置

访问：https://github.com/rao5201/openclaw199/settings/secrets/actions

确认以下三个 Secret 都已添加：

- [ ] `TCB_ENV_ID` - 显示最近更新时间
- [ ] `TCB_KEY_ID` - 显示最近更新时间
- [ ] `TCB_KEY` - 显示最近更新时间

**注意：Secrets 的值是隐藏的，只能看到更新时间。**

---

## 🚀 触发测试部署

### 方法一：推送代码（推荐）

- [ ] 已打开终端或命令提示符
- [ ] 已导航到项目目录
- [ ] 已执行：`echo "# Test auto deployment" >> README.md`
- [ ] 已执行：`git add .`
- [ ] 已执行：`git commit -m "test auto deployment"`
- [ ] 已执行：`git push`

### 方法二：手动触发

- [ ] 已访问 GitHub Actions 页面：https://github.com/rao5201/openclaw199/actions
- [ ] 已选择 "Deploy to CloudBase" 工作流
- [ ] 已点击 "Run workflow" 按钮
- [ ] 已选择分支（默认 `main`）
- [ ] 已点击 "Run workflow" 按钮触发部署

---

## 📊 监控部署状态

### 查看部署日志

- [ ] 已访问 GitHub Actions 页面
- [ ] 已点击最新的运行记录（通常显示黄色或绿色图标）
- [ ] 已查看每个步骤的执行状态
- [ ] 已查看详细的日志输出

### 检查部署步骤

确认以下步骤都显示绿色 ✅：

- [ ] 检出代码
- [ ] 设置 Node.js
- [ ] 安装 CloudBase CLI
- [ ] 配置 CloudBase
- [ ] 部署静态网站
- [ ] 部署云函数
- [ ] 部署成功通知

---

## 🎉 部署成功验证

### 在 CloudBase 控制台验证

访问：https://console.cloud.tencent.com/tcb

#### 静态网站托管

- [ ] 已进入 CloudBase 控制台
- [ ] 已点击左侧"静态网站托管"
- [ ] 已看到 `index.html` 和 `login.html` 文件
- [ ] 已看到 `assets/` 目录
- [ ] 已看到 `cloudbase-sdk.js` 文件

#### 云函数

- [ ] 已进入 CloudBase 控制台
- [ ] 已点击左侧"云函数"
- [ ] 已看到 6 个云函数：
  - [ ] `product-api`
  - [ ] `charity-api`
  - [ ] `ad-api`
  - [ ] `application-api`
  - [ ] `stats-api`
  - [ ] `auth-api`

#### 数据库

- [ ] 已进入 CloudBase 控制台
- [ ] 已点击左侧"数据库"
- [ ] 已看到 6 个集合：
  - [ ] `products`
  - [ ] `charities`
  - [ ] `ads`
  - [ ] `applications`
  - [ ] `settings`
  - [ ] `admins`

### 访问网站

- [ ] 已访问静态网站地址：`https://<环境ID>.tcb.qcloud.la`
- [ ] 网站可以正常打开
- [ ] 可以访问登录页面
- [ ] 可以使用管理员账户登录（`admin` / `admin123`）

---

## ⚠️ 安全检查

### 修改默认密码

- [ ] 已登录后台管理系统
- [ ] 已修改默认管理员密码
- [ ] 新密码已保存

### 密钥管理

- [ ] 密钥未提交到 Git 仓库
- [ ] Secrets 配置正确
- [ ] 定期更新密钥（建议每 3-6 个月）

---

## 🎯 配置完成总结

恭喜！如果以上所有项目都已勾选，说明您的 GitHub Actions 自动部署配置已成功完成！

### 现在您可以：

1. **自动部署**
   - 每次推送代码到 `main` 分支都会自动部署
   - 无需手动操作，完全自动化

2. **查看部署日志**
   - 访问 GitHub Actions 页面
   - 点击任意运行记录查看详细日志

3. **手动触发部署**
   - GitHub Actions → Run workflow
   - 选择分支并运行

4. **监控部署状态**
   - 绿色 ✅ = 部署成功
   - 红色 ❌ = 部署失败（查看日志排查）

---

## 📚 相关文档

- **GitHub Actions 配置指南**: `GITHUB_ACTIONS_SETUP.md`
- **快速开始指南**: `DEPLOYMENT_QUICKSTART.md`
- **完整部署指南**: `DEPLOYMENT_GUIDE.md`
- **GitHub Actions 文档**: https://docs.github.com/cn/actions
- **CloudBase 文档**: https://docs.cloudbase.net/

---

## 🆘 遇到问题？

### 常见问题

1. **部署失败 - "Authentication failed"**
   - 检查 GitHub Secrets 中的 `TCB_KEY_ID` 和 `TCB_KEY` 是否正确
   - 尝试重新生成密钥

2. **部署失败 - "Environment not found"**
   - 检查 GitHub Secrets 中的 `TCB_ENV_ID` 是否正确
   - 确认 CloudBase 环境是否存在

3. **云函数部署失败**
   - 检查 `cloudbaserc.json` 配置是否正确
   - 检查云函数代码语法

4. **静态网站部署失败**
   - 确认 `index.html` 和 `login.html` 存在
   - 检查静态网站托管是否已启用

### 获取帮助

- 查看详细指南: `GITHUB_ACTIONS_SETUP.md`
- 查看 CloudBase 文档: https://docs.cloudbase.net/
- 查看 GitHub Actions 文档: https://docs.github.com/cn/actions

---

**配置完成时间：约 10-15 分钟**

**祝您使用愉快！** 🎉
