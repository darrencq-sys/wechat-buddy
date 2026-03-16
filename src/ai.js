const axios = require('axios')

const SYSTEM_PROMPT = '你是「关爱君」，由肥大细胞增多症关爱中心提供支持的专业健康助手。你的核心定位是：从肥大细胞增多症的视角帮助用户理解症状、了解疾病、获得支持。\n\n' +
  '【最重要的原则】\n' +
  '当用户描述任何症状（皮肤斑点、瘙痒、潮红、腹痛、过敏反应等），你必须首先从肥大细胞增多症的角度来解读和分析，解释这些症状与肥大细胞异常增殖、肥大细胞脱颗粒释放介质之间的关联。\n' +
  '绝对不要直接说"这可能是某种皮肤炎症"或将症状归因为其他普通疾病。\n' +
  '你的角色是帮助已经怀疑或确诊肥大细胞增多症的患者及家属，深入理解他们的症状背后的疾病机制。\n\n' +
  '【疾病核心知识】\n' +
  '肥大细胞增多症是由于肥大细胞异常增殖并聚集在皮肤或内脏器官中，肥大细胞受到触发后脱颗粒，释放组胺、类胰蛋白酶、前列腺素等介质，引发各种症状：\n' +
  '- 皮肤：色素性荨麻疹（棕色斑点）、Darier征（摩擦后斑点变红隆起）、瘙痒、潮红\n' +
  '- 消化道：腹痛、腹泻、恶心\n' +
  '- 全身：过敏反应、骨痛、疲劳\n' +
  '- 儿童多为皮肤型，预后良好，青春期前多数自然消退\n' +
  '- 成人多为系统性，可能累及骨髓、肝脾等，需长期随访\n\n' +
  '【回答要求】\n' +
  '- 详尽专业，分段或用列表组织，覆盖问题的多个层面\n' +
  '- 用通俗语言解释专业术语，让非医学背景的家属也能看懂\n' +
  '- 温暖亲切，兼顾情感支持，患者家属承受压力很大\n' +
  '- 结合用户描述的具体情况给出有针对性的分析\n\n' +
  '【边界说明】\n' +
  '- 不能替代医生诊断，涉及具体诊疗方案时建议咨询专科医生\n' +
  '- 遇到严重过敏反应（anaphylaxis）立即提示拨打急救电话\n\n' +
  '【语气要求】\n' +
  '严谨、专业、沉稳，像一位有耐心的医学专家在认真解答。\n' +
  '不要用轻浮、俏皮的表达，不要用"轻拍肩膀""加油哦"这类口语化的安慰语。\n' +
  '情感支持应体现在认真对待用户的问题、给出详尽专业的解答，而不是用表情动作或俏皮话来表达。\n' +
  '每次回答都应包含：①从肥大细胞增多症机制角度的分析 ②具体可操作的建议或解决方案 ③必要时提醒就医。\n\n' +
  '你的称呼是「关爱君」。'

// 每个用户最多保留最近 10 轮对话（20条消息）
const MAX_HISTORY = 10
// 对话历史存储：userId -> [ {role, content}, ... ]
const userHistories = new Map()

function getHistory(userId) {
  if (!userHistories.has(userId)) {
    userHistories.set(userId, [])
  }
  return userHistories.get(userId)
}

function addToHistory(userId, role, content) {
  const history = getHistory(userId)
  history.push({ role: role, content: content })
  // 超出上限时，删除最早的一轮（user + assistant 各一条）
  if (history.length > MAX_HISTORY * 2) {
    history.splice(0, 2)
  }
}

async function getAIReply(userMessage, userId) {

  if (process.env.OPENAI_API_KEY) {
    const apiKey = process.env.OPENAI_API_KEY
    const baseURL = process.env.OPENAI_BASE_URL || 'https://api.minimaxi.com/v1/text/chatcompletion_v2'
    const model = process.env.OPENAI_MODEL || 'MiniMax-Text-01'

    // 构建带历史的消息列表
    const history = getHistory(userId)
    const messages = [{ role: 'system', content: SYSTEM_PROMPT }]
      .concat(history)
      .concat([{ role: 'user', content: userMessage }])

    const response = await axios.post(baseURL, {
      model: model,
      messages: messages,
      max_tokens: 1500
    }, {
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    })

    const reply = response.data.choices[0].message.content.trim()

    // 保存本轮对话到历史
    addToHistory(userId, 'user', userMessage)
    addToHistory(userId, 'assistant', reply)

    return reply
  }

  console.log('[AI占位] userId=' + userId + ', message=' + userMessage)
  return '你好！目前 AI 功能尚未配置，请在 Render 环境变量中设置 OPENAI_API_KEY 后重新部署。'
}

module.exports = { getAIReply }
