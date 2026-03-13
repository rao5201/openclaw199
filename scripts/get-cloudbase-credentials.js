/**
 * CloudBase 凭证获取辅助脚本
 *
 * 使用方法：
 * node scripts/get-cloudbase-credentials.js
 *
 * 注意：此脚本仅用于展示如何获取凭证，实际操作需要在腾讯云控制台完成
 */

console.log(`
========================================
CloudBase 凭证获取指南
========================================

本脚本将指导您如何获取 CloudBase 部署所需的凭证。

----------------------------------------
步骤 1：登录腾讯云控制台
----------------------------------------

1. 访问：https://console.cloud.tencent.com/
2. 使用腾讯云账号登录

----------------------------------------
步骤 2：进入 CloudBase 控制台
----------------------------------------

1. 在搜索框中输入 "CloudBase" 或 "云开发"
2. 点击进入 CloudBase 控制台
3. 选择您的环境（如果没有，请先创建一个）

----------------------------------------
步骤 3：获取环境 ID (TCB_ENV_ID)
----------------------------------------

在 CloudBase 环境概览页面，您会看到：

环境 ID: openclaw-xxxxx

这就是您的环境 ID，例如：openclaw-7g2j3k4l5m

请复制并保存这个环境 ID。

----------------------------------------
步骤 4：创建访问密钥
----------------------------------------

您需要创建两个密钥值：
- TCB_KEY_ID    (密钥 ID)
- TCB_KEY       (密钥内容)

方法一：使用云函数密钥（推荐）

1. 在 CloudBase 控制台，点击左侧菜单 "云函数"
2. 点击右上角 "更多" → "函数设置"
3. 找到 "访问密钥" 部分
4. 点击 "添加密钥"
5. 输入密钥名称（如：github-actions）
6. 系统会生成 Key ID 和 Key Content
7. 保存这两个值

方法二：使用环境密钥

1. 在 CloudBase 控制台，点击左侧菜单 "环境"
2. 选择您的环境，进入环境详情页
3. 点击 "环境设置"
4. 找到 "环境密钥" 部分
5. 点击 "获取密钥" 或 "创建密钥"
6. 保存生成的密钥 ID 和密钥内容

----------------------------------------
步骤 5：配置 GitHub Secrets
----------------------------------------

1. 访问您的 GitHub 仓库：https://github.com/rao5201/openclaw199
2. 点击仓库顶部导航栏的 Settings (⚙️ 设置)
3. 在左侧菜单中找到 "Secrets and variables" → "Actions"
4. 点击 "New repository secret" 按钮，添加以下 3 个 Secret：

Secret 1: TCB_ENV_ID（环境 ID）
Name:   TCB_ENV_ID
Value:  您的 CloudBase 环境 ID（如：openclaw-7g2j3k4l5m）

Secret 2: TCB_KEY_ID（密钥 ID）
Name:   TCB_KEY_ID
Value:  您的密钥 ID（如：xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx）

Secret 3: TCB_KEY（密钥内容）
Name:   TCB_KEY
Value:  您的密钥内容（长字符串）

----------------------------------------
步骤 6：验证配置
----------------------------------------

配置完成后，触发一次测试部署：

cd C:\\Users\\Lenovo\\Desktop\\安全防护网站代码\\网站后台文件夹
echo "# Test auto deployment" >> README.md
git add .
git commit -m "test auto deployment"
git push

或手动触发：
1. 访问 GitHub 仓库的 Actions 标签
2. 选择 "Deploy to CloudBase" 工作流
3. 点击 "Run workflow" 按钮

----------------------------------------
步骤 7：监控部署状态
----------------------------------------

1. 访问 GitHub 仓库的 Actions 标签
2. 点击最新的运行记录
3. 查看每个步骤的执行日志
4. 部署成功后会显示网站地址

----------------------------------------
重要提示
----------------------------------------

⚠️  安全提醒：
   - 不要将 CloudBase 密钥直接写在代码中
   - 不要在公开的地方暴露密钥
   - 定期更新密钥（建议每 3-6 个月）

📖 相关文档：
   - GitHub Actions 文档: https://docs.github.com/cn/actions
   - CloudBase 文档: https://docs.cloudbase.net/

🆘 遇到问题？
   - 查看详细指南: GITHUB_ACTIONS_SETUP.md
   - 查看 CloudBase 文档: https://docs.cloudbase.net/

========================================
`);
