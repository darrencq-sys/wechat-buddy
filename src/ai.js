const axios = require('axios')

/**
 * AI 回复模块
 * 在这里接入你的 AI API
 *
 * @param {string} userMessage 用户发的消息
 * @param {string} userId 用户 openid（可用于多轮对话）
 * @returns {Promise<string>} 回复内容
 */
async function getAIReply(userMessage, userId) {

  // ================================================================
  // 方案 A：OpenAI / 任何兼容 OpenAI 格式的 API（推荐）
  // 环境变量：OPENAI_API_KEY, OPENAI_BASE_URL（可选，默认 openai）
  // ================================================================
  if (process.env.OPENAI_API_KEY) {
    const baseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'

    const response = await axios.post(`${baseURL}/chat/completions`, {
      model,
      messages: [
        { role: 'system', content: '你是一个有帮助的助手，名叫 BUDDY。回答简洁、友好，适合微信聊天场景。' },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 500
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    })

    return response.data.choices[0].message.content.trim()
  }

  // ================================================================
  // 方案 B：腾讯混元
  // 环境变量：HUNYUAN_SECRET_ID, HUNYUAN_SECRET_KEY
  // ================================================================
  // if (process.env.HUNYUAN_SECRET_ID) {
  //   const tencentcloud = require('tencentcloud-sdk-nodejs')
  //   const HunyuanClient = tencentcloud.hunyuan.v20230901.Client
  //   const client = new HunyuanClient({
  //     credential: {
  //       secretId: process.env.HUNYUAN_SECRET_ID,
  //       secretKey: process.env.HUNYUAN_SECRET_KEY,
  //     },
  //     region: 'ap-guangzhou',
  //   })
  //   const result = await client.ChatCompletions({
  //     Model: 'hunyuan-turbo',
  //     Messages: [
  //       { Role: 'system', Content: '你是 BUDDY 机器人，回答简洁友好。' },
  //       { Role: 'user', Content: userMessage }
  //     ]
  //   })
  //   return result.Choices[0].Message.Content.trim()
  // }

  // ================================================================
  // 占位回复（未配置任何 AI 时使用，用于测试连通性）
  // ================================================================
  console.log(`[AI占位] userId=${userId}, message=${userMessage}`)
  return `你好！我收到了你的消息："${userMessage}"\n\n目前 AI 功能尚未配置，请在 Render 环境变量中设置 OPENAI_API_KEY 后重新部署。`
}

module.exports = { getAIReply }
