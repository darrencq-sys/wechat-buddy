# 微信公众号 BUDDY 机器人

> 企业订阅号 + Render 免费托管 + 任意 AI API

用户在微信里给公众号发消息，机器人自动调用 AI 回复。

---

## 项目结构

```
wechat-buddy/
├── src/
│   ├── index.js      # Express 服务入口（签名验证 + 消息路由）
│   ├── wechat.js     # 微信工具（签名验证、XML解析、消息构建）
│   └── ai.js         # AI 模块（在这里接入你的 AI）
├── .env.example      # 环境变量说明
├── .gitignore
├── render.yaml       # Render 部署配置
└── package.json
```

---

## 部署步骤（约 15 分钟）

### 第一步：把代码推送到 GitHub

1. 打开 [github.com](https://github.com) 新建一个仓库，名字随意（如 `wechat-buddy`）
2. 在本项目目录下执行：

```bash
git init
git add .
git commit -m "init wechat buddy"
git remote add origin https://github.com/你的用户名/wechat-buddy.git
git push -u origin main
```

---

### 第二步：在 Render 上部署

1. 打开 [render.com](https://render.com) → 注册/登录（免费）
2. 点击 **New → Web Service**
3. 连接你的 GitHub 仓库，选择 `wechat-buddy`
4. 配置如下：

   | 字段 | 值 |
   |------|-----|
   | Runtime | Node |
   | Build Command | `npm install` |
   | Start Command | `npm start` |
   | Instance Type | **Free** |

5. 点击 **Advanced → Add Environment Variable**，添加：

   | Key | Value |
   |-----|-------|
   | `WECHAT_TOKEN` | 你自己想的一个字符串，如 `BuddyToken2026` |
   | `OPENAI_API_KEY` | 你的 API Key（后面也可以加） |

6. 点击 **Create Web Service**，等待部署完成（约 2 分钟）
7. 部署成功后，复制页面顶部的地址，格式为：
   ```
   https://wechat-buddy-xxxx.onrender.com
   ```

---

### 第三步：配置微信公众号

1. 登录 [微信公众平台](https://mp.weixin.qq.com)
2. 左侧菜单：**设置与开发 → 基本配置**
3. 在「服务器配置」区域点击**启用**，填写：

   | 字段 | 值 |
   |------|-----|
   | 服务器地址(URL) | `https://wechat-buddy-xxxx.onrender.com/wechat` |
   | 令牌(Token) | 与 Render 环境变量 `WECHAT_TOKEN` 完全一致 |
   | 消息加解密方式 | 明文模式（先用这个，稳定后可升级） |

4. 点击**提交**
   - 微信会向你的服务器发 GET 请求验证
   - 验证成功提示「提交成功」

5. 点击**启用**，完成配置

---

### 第四步：测试

用微信关注你的公众号，发送任意文字消息。

- **未配置 AI Key 时**：收到占位回复 → 说明整条链路通了 ✅
- **配置 AI Key 后**：收到真实 AI 回复 ✅

---

### 第五步：接入 AI

在 Render 的服务页面 → **Environment** → 添加或更新：

```
OPENAI_API_KEY = sk-你的key
```

保存后 Render 自动重新部署，约 1 分钟生效。

> 如果你用的是国内中转 API（如 ChatAnywhere、One API 等），还需要加：
> ```
> OPENAI_BASE_URL = https://你的中转地址/v1
> OPENAI_MODEL = gpt-4o-mini
> ```

---

## 常见问题

**Q：微信验证失败？**
- 检查 `WECHAT_TOKEN` 和公众平台填写的 Token 是否完全一致（区分大小写）
- 检查 URL 是否带了 `/wechat` 路径
- Render 免费版首次请求可能冷启动需要 30 秒，可先访问 `https://你的域名/` 唤醒服务

**Q：发消息没有回复？**
- Render 面板 → Logs 查看日志，确认消息有没有收到
- 微信要求 5 秒内响应，AI 太慢时会显示「该公众号暂时无法提供服务」，属正常（代码已做 4.5 秒超时兜底）

**Q：Render 免费版有什么限制？**
- 每月 750 小时运行时间（单个服务免费跑满一个月）
- 无流量超 15 分钟自动休眠（首次收到消息会冷启动约 30 秒）
- 如需无延迟，升级到 $7/月的 Starter 套餐即可

---

## 后续扩展

- **多轮对话**：在 `ai.js` 里引入数据库（如免费的 MongoDB Atlas）存储每个用户的对话历史
- **指令菜单**：在 `index.js` 中加关键词判断，如发「帮助」返回功能列表
- **图片理解**：接入支持 vision 的模型（GPT-4o），处理用户发的图片
