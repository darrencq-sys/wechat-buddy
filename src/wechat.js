const crypto = require('crypto')
const xml2js = require('xml2js')

/**
 * 验证微信服务器签名
 * @param {string} token 你在公众平台配置的 Token
 * @param {string} timestamp
 * @param {string} nonce
 * @param {string} signature 微信传来的签名
 * @returns {boolean}
 */
function verifySignature(token, timestamp, nonce, signature) {
  const arr = [token, timestamp, nonce].sort()
  const str = arr.join('')
  const hash = crypto.createHash('sha1').update(str).digest('hex')
  return hash === signature
}

/**
 * 解析微信推送的 XML 消息
 * @param {string} xmlBody
 * @returns {Promise<Object>}
 */
async function parseMessage(xmlBody) {
  const result = await xml2js.parseStringPromise(xmlBody, { explicitArray: false })
  return result.xml
}

/**
 * 构建被动回复文本消息（XML 格式）
 * @param {string} toUser 接收方 openid
 * @param {string} fromUser 公众号原始 ID
 * @param {string} content 回复内容
 * @returns {string} XML 字符串
 */
function buildTextReply(toUser, fromUser, content) {
  const now = Math.floor(Date.now() / 1000)
  return `<xml>
  <ToUserName><![CDATA[${toUser}]]></ToUserName>
  <FromUserName><![CDATA[${fromUser}]]></FromUserName>
  <CreateTime>${now}</CreateTime>
  <MsgType><![CDATA[text]]></MsgType>
  <Content><![CDATA[${content}]]></Content>
</xml>`
}

module.exports = { verifySignature, parseMessage, buildTextReply }
