# GitHub Actions 自动部署配置指南

本指南将帮助您配置 GitHub Actions，实现代码推送后自动部署到 CloudBase。

---

## 📋 目录

1. [前提条件](#前提条件)
2. [获取 CloudBase 凭证](#获取-cloudbase-凭证)
3. [配置 GitHub Secrets](#配置-github-secrets)
4. [触发自动部署](#触发自动部署)
5. [监控部署状态](#监控部署状态)
6. [故障排查](#故障排查)

---

## 前提条件

在开始之前，请确保您已完成：

- ✅ 已注册腾讯云账号：https://cloud.tencent.com/
- ✅ 已开通 CloudBase 服务
- ✅ 已创建 CloudBase 环境
- ✅ 代码已推送到 GitHub 仓库

---

## 获取 CloudBase 凭证

### 步骤 1：登录腾讯云控制台

1. 访问：https://console.cloud.tencent.com/
2. 使用腾讯云账号登录

### 步骤 2：进入 CloudBase 控制台

1. 在搜索框中输入 "CloudBase" 或 "云开发"
2. 点击进入 CloudBase 控制台
3. 选择您的环境（如果没有，请先创建一个）

### 步骤 3：获取环境 ID

在 CloudBase 环境概览页面，您会看到：

```
环境 ID: openclaw-xxxxx (这就是您的环境 ID)
```

**复制这个环境 ID，稍后配置时需要用到。**

示例：`openclaw-7g2j3k4l5m`

### 步骤 4：创建访问密钥

#### 方法一：使用云函数密钥（推荐）

1. 在 CloudBase 控制台，点击左侧菜单 **"云函数"**
2. 点击右上角 **"更多"** → **"函数设置"**
3. 找到 **"访问密钥"** 部分
4. 点击 **"添加密钥"**
5. 输入密钥名称（如：`github-actions`）
6. 系统会生成 **Key ID** 和 **Key Content**

**请保存这两个值：**
```
Key ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Key Content: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### 方法二：使用环境密钥

1. 在 CloudBase 控制台，点击左侧菜单 **"环境"**
2. 选择您的环境，进入环境详情页
3. 点击 **"环境设置"**
4. 找到 **"环境密钥"** 部分
5. 点击 **"获取密钥"** 或 **"创建密钥"**
6. 保存生成的密钥 ID 和密钥内容

---

## 配置 GitHub Secrets

### 步骤 1：进入 GitHub 仓库设置

1. 访问您的 GitHub 仓库：https://github.com/rao5201/openclaw199
2. 点击仓库顶部导航栏的 **Settings**（⚙️ 设置）
3. 在左侧菜单中找到 **"Secrets and variables"** → **"Actions"**

### 步骤 2：添加 Secrets

点击 **"New repository secret"** 按钮，添加以下 3 个 Secret：

#### Secret 1: TCB_ENV_ID（环境 ID）

- **Name**: `TCB_ENV_ID`
- **Value**: 您的 CloudBase 环境 ID（如：`openclaw-7g2j3k4l5m`）
- 点击 **Add secret**

#### Secret 2: TCB_KEY_ID（密钥 ID）

- **Name**: `TCB_KEY_ID`
- **Value**: 您的密钥 ID（如：`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`）
- 点击 **Add secret**

#### Secret 3: TCB_KEY（密钥内容）

- **Name**: `TCB_KEY`
- **Value**: 您的密钥内容（长字符串）
- 点击 **Add secret**

### 步骤 3：验证 Secrets 配置

添加完成后，您应该看到 3 个 Secrets：

```
TCB_ENV_ID        Updated 2 minutes ago
TCB_KEY_ID        Updated 2 minutes ago
TCB_KEY           Updated 2 minutes ago
```

**注意：Secrets 的值是隐藏的，只能看到更新时间。**

---

## 触发自动部署

配置完成后，每次推送代码到 `main` 分支都会自动触发部署。

### 方法一：直接推送代码（最简单）

```bash
cd C:\Users\Lenovo\Desktop\安全防护网站代码\网站后台文件夹

# 修改一个文件以触发部署
echo "# Test auto deployment" >> README.md

# 提交并推送
git add .
git commit -m "test auto deployment"
git push
```

### 方法二：手动触发（推荐用于测试）

1. 访问 GitHub 仓库：https://github.com/rao5201/openclaw199
2. 点击顶部导航栏的 **Actions** 标签
3. 左侧选择 **"Deploy to CloudBase"** 工作流
4. 点击右侧 **"Run workflow"** 按钮
5. 选择分支（默认 `main`）
6. 点击 **"Run workflow"** 按钮触发部署

---

## 监控部署状态

### 查看部署日志

1. 访问 GitHub 仓库的 **Actions** 标签
2. 点击最新的运行记录（通常标记为绿色 ✅ 或红色 ❌）
3. 您可以看到每个步骤的执行日志

### 部署步骤说明

GitHub Actions 工作流包含以下步骤：

```
1. Checkout code        - 检出代码
2. Setup Node.js        - 安装 Node.js 环境
3. Install dependencies - 安装依赖（包括 CloudBase CLI）
4. Deploy to CloudBase  - 部署到 CloudBase
   ├─ 部署静态网站
   ├─ 部署云函数
   └─ 部署数据库（可选）
```

### 部署成功标志

如果部署成功，您会看到：

- ✅ 所有步骤都显示绿色
- 最后一个步骤显示 "Deployed to CloudBase successfully!"
- 您可以通过 CloudBase 控制台验证部署结果

---

## 故障排查

### 问题 1：部署失败 - "Authentication failed"

**错误信息：**
```
Error: Authentication failed. Please check your TCB_KEY_ID and TCB_KEY.
```

**解决方案：**
1. 检查 GitHub Secrets 中的 `TCB_KEY_ID` 和 `TCB_KEY` 是否正确
2. 确保密钥在 CloudBase 控制台中未过期
3. 尝试重新生成密钥

### 问题 2：部署失败 - "Environment not found"

**错误信息：**
```
Error: Environment not found. Please check your TCB_ENV_ID.
```

**解决方案：**
1. 检查 GitHub Secrets 中的 `TCB_ENV_ID` 是否正确
2. 确认 CloudBase 环境是否存在
3. 确认环境状态为"运行中"

### 问题 3：云函数部署失败

**错误信息：**
```
Error: Failed to deploy cloud functions.
```

**解决方案：**
1. 检查 `cloudbaserc.json` 配置是否正确
2. 确认云函数代码语法无误
3. 在 CloudBase 控制台手动创建云函数测试

### 问题 4：静态网站部署失败

**错误信息：**
```
Error: Failed to deploy static website.
```

**解决方案：**
1. 确认 `index.html` 和 `login.html` 存在
2. 检查静态网站托管是否已启用
3. 检查文件路径是否正确

---

## 🔐 安全提示

### 1. 不要提交敏感信息

- ❌ 不要将 CloudBase 密钥直接写在代码中
- ❌ 不要将环境 ID 写在公开的配置文件中
- ✅ 必须使用 GitHub Secrets 存储敏感信息

### 2. 定期更新密钥

- 建议每 3-6 个月更新一次 CloudBase 密钥
- 更新密钥后，同步更新 GitHub Secrets

### 3. 限制权限

- 为 GitHub Actions 创建专用的 CloudBase 密钥
- 不要使用主账号密钥

---

## 📊 部署架构图

```
GitHub 仓库
    ↓ (推送代码)
GitHub Actions
    ↓ (读取 Secrets)
CloudBase CLI
    ↓
CloudBase 环境
    ├─ 静态网站托管 (网站前台+后台)
    ├─ 云函数 (API 接口)
    ├─ NoSQL 数据库 (数据存储)
    └─ 云存储 (文件上传)
```

---

## 🚀 快速开始（5 分钟）

如果您已经准备好了 CloudBase 凭证，可以快速配置：

```bash
# 1. 获取 CloudBase 凭证（手动在腾讯云控制台操作）
#    - 环境 ID
#    - 密钥 ID
#    - 密钥内容

# 2. 在 GitHub 配置 Secrets（手动操作）
#    Settings → Secrets and variables → Actions → New repository secret
#    添加：TCB_ENV_ID, TCB_KEY_ID, TCB_KEY

# 3. 触发自动部署
cd C:\Users\Lenovo\Desktop\安全防护网站代码\网站后台文件夹
echo "# Trigger auto deployment" >> README.md
git add .
git commit -m "trigger auto deployment"
git push
```

---

## 📚 相关文档

- [GitHub Actions 文档](https://docs.github.com/cn/actions)
- [CloudBase 文档](https://docs.cloudbase.net/)
- [CloudBase CLI 文档](https://docs.cloudbase.net/cli/intro)

---

## 💡 提示

### 1. 测试部署

首次配置后，建议先手动触发部署测试：
- GitHub Actions → 选择工作流 → Run workflow

### 2. 监控部署时间

部署通常需要 2-5 分钟：
- 代码检出：10-20 秒
- 安装依赖：30-60 秒
- 部署静态网站：30-60 秒
- 部署云函数：60-120 秒

### 3. 查看部署结果

部署完成后，访问 CloudBase 控制台验证：
- 静态网站托管 → 查看文件列表
- 云函数 → 查看函数列表
- 数据库 → 查看集合列表

---

## ✅ 配置检查清单

完成配置前，请确认：

- [ ] 已获取 CloudBase 环境 ID
- [ ] 已创建 CloudBase 访问密钥（Key ID 和 Key Content）
- [ ] 已在 GitHub 添加 Secret: `TCB_ENV_ID`
- [ ] 已在 GitHub 添加 Secret: `TCB_KEY_ID`
- [ ] 已在 GitHub 添加 Secret: `TCB_KEY`
- [ ] GitHub Actions 工作流文件已提交
- [ ] 已触发一次部署测试
- [ ] 部署成功且功能正常

---

## 🎉 完成！

配置完成后，您只需推送代码即可自动部署：

```bash
git add .
git commit -m "update content"
git push

# 自动部署开始，等待 2-5 分钟后即可访问新版本
```

**祝您部署顺利！**
