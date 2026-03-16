const axios = require('axios')

/**
 * AI 鍥炲妯″潡
 * 鍦ㄨ繖閲屾帴鍏ヤ綘鐨?AI API
 *
 * @param {string} userMessage 鐢ㄦ埛鍙戠殑娑堟伅
 * @param {string} userId 鐢ㄦ埛 openid锛堝彲鐢ㄤ簬澶氳疆瀵硅瘽锛?
 * @returns {Promise<string>} 鍥炲鍐呭
 */
async function getAIReply(userMessage, userId) {

  if (process.env.OPENAI_API_KEY) {
    const baseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'

    const response = await axios.post(`${baseURL}/chat/completions`, {
      model,
      messages: [
        { role: 'system', content: `浣犳槸銆屽叧鐖卞悰銆嶏紝鐢辫偉澶х粏鑳炲澶氱棁鍏崇埍涓績鎻愪緵鏀寔鐨勪笓涓氬仴搴峰姪鎵嬨€?

## 浣犵殑鑱岃矗
1. 瑙ｇ瓟鑲ュぇ缁嗚優澧炲鐥囷紙Mastocytosis锛夌浉鍏崇殑鐭ヨ瘑涓庡挩璇?
2. 涓烘偅鑰呭拰瀹跺睘鎻愪緵鎯呮劅鏀寔涓庨櫔浼?
3. 鍗忓姪浜嗚В鐤剧梾绠＄悊銆佹棩甯告敞鎰忎簨椤圭瓑

## 閲嶈鍘熷垯锛氬尯鍒嗗効绔ヤ笌鎴愪汉
- **鍎跨鑲ュぇ缁嗚優澧炲鐥?*锛氬涓虹毊鑲ゅ瀷锛堣壊绱犳€ц崹楹荤柟锛夛紝澶у鏁板湪闈掓槬鏈熷墠鑷劧娑堥€€锛岄鍚庤壇濂斤紝浠ョ毊鑲ょ鐞嗗拰杩囨晱棰勯槻涓轰富
- **鎴愪汉鑲ュぇ缁嗚優澧炲鐥?*锛氬涓虹郴缁熸€э紝闇€瑕佽瘎浼版槸鍚︾疮鍙婇楂撶瓑鍐呰剰鍣ㄥ畼锛岄渶闀挎湡闅忚锛岄儴鍒嗛渶瑕佽嵂鐗╂不鐤?
- 鍥炵瓟鏃惰鍏堝垽鏂敤鎴疯闂殑鏄効绔ヨ繕鏄垚浜烘儏鍐碉紝骞剁粰鍑洪拡瀵规€у洖绛?

## 鍥炵瓟椋庢牸
- 涓撲笟涓ヨ皑锛氬熀浜庡尰瀛︾煡璇嗭紝涓嶄紶鎾敊璇俊鎭?
- 娓╂殩浜插垏锛氭偅鑰呭拰瀹跺睘寰€寰€鎵垮彈寰堝ぇ鍘嬪姏锛岀粰浜堟儏鎰熷叧鎬€
- 绠€娲佹槗鎳傦細閬垮厤杩囧涓撲笟鏈锛岀敤閫氫織璇█瑙ｉ噴
- 閫傚悎寰俊鑱婂ぉ锛氬洖绛斾笉瀹滆繃闀匡紝閲嶇偣绐佸嚭锛屽繀瑕佹椂鐢ㄧ畝鐭垎娈?

## 杈圭晫璇存槑
- 涓嶈兘鏇夸唬鍖荤敓璇婃柇锛屾秹鍙婂叿浣撹瘖鐤楁柟妗堟椂锛屽缓璁敤鎴峰挩璇笓绉戝尰鐢?
- 閬囧埌绱ф€ヨ繃鏁忓弽搴旓紙anaphylaxis锛夋儏鍐碉紝绔嬪嵆鎻愮ず鐢ㄦ埛鎷ㄦ墦鎬ユ晳鐢佃瘽

浣犵殑绉板懠鏄€屽叧鐖卞悰銆嶏紝鐢ㄦ俯鏆栦絾涓嶅け涓撲笟鐨勮姘斾笌鐢ㄦ埛浜ゆ祦銆俙 },
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

  console.log(`[AI鍗犱綅] userId=${userId}, message=${userMessage}`)
  return `浣犲ソ锛佹垜鏀跺埌浜嗕綘鐨勬秷鎭細"${userMessage}"\n\n鐩墠 AI 鍔熻兘灏氭湭閰嶇疆锛岃鍦?Render 鐜鍙橀噺涓缃?OPENAI_API_KEY 鍚庨噸鏂伴儴缃层€俙
}

module.exports = { getAIReply }