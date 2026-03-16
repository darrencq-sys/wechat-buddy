const express = require('express')
const { verifySignature, parseMessage, buildTextReply } = require('./wechat')
const { getAIReply } = require('./ai')

const app = express()
const PORT = process.env.PORT || 3000

// 接收原始 XML body
app.use(express.text({ type: '*/xml' }))
app.use(express.json())

/**
 * GET /wechat
 * 微信服务器验证接口（首次配置时调用一次）
 */
app.get('/wechat', (req, res) => {
  const { signature, timestamp, nonce, echostr } = req.query
  const token = process.env.WECHAT_TOKEN

  if (!token) {
    return res.status(500).send('未配置 WECHAT_TOKEN 环境变量')
  }

  if (verifySignature(token, timestamp, nonce, signature)) {
    console.log('[验证] 微信服务器验证成功')
    res.send(echostr)
  } else {
    console.warn('[验证] 签名校验失败')
    res.status(403).send('验证失败')
  }
})

/**
 * POST /wechat
 * 接收微信推送的用户消息
 */
app.post('/wechat', async (req, res) => {
  try {
    const msg = await parseMessage(req.body)
    console.log('[消息] 收到:', JSON.stringify(msg))

    const { MsgType, Event, Content, FromUserName, ToUserName } = msg

    // 关注事件
    if (MsgType === 'event' && Event === 'subscribe') {
      const reply = buildTextReply(FromUserName, ToUserName,
        '👋 你好！我是 BUDDY 机器人\n\n直接发文字消息给我，我会尽力回答你的问题～')
      return res.set('Content-Type', 'application/xml').send(reply)
    }

    // 取消关注 / 其他事件 → 不回复
    if (MsgType === 'event') {
      return res.send('success')
    }

    // 文本消息 → 调用 AI
    if (MsgType === 'text') {
      const userText = (Content || '').trim()
      if (!userText) return res.send('success')

      // 先给微信返回"正在思考"，避免超时（微信要求 5 秒内响应）
      // 注意：如果 AI 响应较慢，可改为异步客服消息接口
      const aiReply = await Promise.race([
        getAIReply(userText, FromUserName),
        new Promise(resolve => setTimeout(() => resolve('正在思考中，请再发一次试试～'), 4500))
      ])

      const reply = buildTextReply(FromUserName, ToUserName, aiReply)
      return res.set('Content-Type', 'application/xml').send(reply)
    }

    // 图片、语音等其他类型
    const reply = buildTextReply(FromUserName, ToUserName, '暂时只支持文字消息，请发送文字提问～')
    return res.set('Content-Type', 'application/xml').send(reply)

  } catch (err) {
    console.error('[错误]', err)
    res.send('success')
  }
})

// 健康检查
app.get('/', (req, res) => res.send('BUDDY 机器人运行中 ✅'))

app.listen(PORT, () => {
  console.log(`✅ 服务启动，端口 ${PORT}`)
  console.log(`   微信回调地址: POST /wechat`)
})
