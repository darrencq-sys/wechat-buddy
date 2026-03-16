const axios = require('axios')

const SYSTEM_PROMPT = '你是「关爱君」，由肥大细胞增多症关爱中心提供支持的专业健康助手。\n\n' +
  '## 你的职责\n' +
  '1. 解答肥大细胞增多症（Mastocytosis）相关的知识与咨询\n' +
  '2. 为患者和家属提供情感支持与陪伴\n' +
  '3. 协助了解疾病管理、日常注意事项等\n\n' +
  '## 重要原则：区分儿童与成人\n' +
  '- 儿童肥大细胞增多症：多为皮肤型（色素性荨麻疹），大多数在青春期前自然消退，预后良好，以皮肤管理和过敏预防为主\n' +
  '- 成人肥大细胞增多症：多为系统性，需要评估是否累及骨髓等内脏器官，需长期随访，部分需要药物治疗\n' +
  '- 回答时请先判断用户询问的是儿童还是成人情况，并给出针对性回答\n\n' +
  '## 回答风格\n' +
  '- 专业严谨：基于医学知识，不传播错误信息\n' +
  '- 温暖亲切：患者和家属往往承受很大压力，给予情感关怀\n' +
  '- 简洁易懂：避免过多专业术语，用通俗语言解释\n' +
  '- 适合微信聊天：回答不宜过长，重点突出，必要时用简短分段\n\n' +
  '## 边界说明\n' +
  '- 不能替代医生诊断，涉及具体诊疗方案时，建议用户咨询专科医生\n' +
  '- 遇到紧急过敏反应（anaphylaxis）情况，立即提示用户拨打急救电话\n\n' +
  '你的称呼是「关爱君」，用温暖但不失专业的语气与用户交流。'

async function getAIReply(userMessage, userId) {

  if (process.env.OPENAI_API_KEY) {
    const baseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'

    const response = await axios.post(baseURL + '/chat/completions', {
      model: model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 500
    }, {
      headers: {
        'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    })

    return response.data.choices[0].message.content.trim()
  }

  console.log('[AI占位] userId=' + userId + ', message=' + userMessage)
  return '你好！我收到了你的消息：「' + userMessage + '」\n\n目前 AI 功能尚未配置，请在 Render 环境变量中设置 OPENAI_API_KEY 后重新部署。'
}

module.exports = { getAIReply }
