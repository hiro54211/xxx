import OpenAI from 'openai';
import { GeneratedStand } from '../types';

// --- 调试区域：请在浏览器控制台查看这些输出 ---
console.log("=== API CONFIG DEBUG ===");
console.log("API Key Exists:", !!import.meta.env.VITE_ARK_API_KEY);
console.log("Base URL:", import.meta.env.VITE_ARK_BASE_URL);
console.log("Model ID:", import.meta.env.VITE_ARK_MODEL);
// ------------------------------------------

// 初始化客户端
const client = new OpenAI({
  apiKey: import.meta.env.VITE_ARK_API_KEY,
  baseURL: import.meta.env.VITE_ARK_BASE_URL,
  dangerouslyAllowBrowser: true // 允许在前端运行
});

const MODEL_ID = import.meta.env.VITE_ARK_MODEL;

// 替身设定生成函数 (Text Generation)
export async function generateStandProfile(userName: string, personality: string): Promise<GeneratedStand> {
  // 定义提示词，强制模型输出 JSON
  const systemPrompt = `
    你是一个《JOJO的奇妙冒险》替身生成器。
    请根据用户的名字和性格/氛围，通过分析其"灵魂信号"来生成一个独特的替身。
    
    【重要】你必须严格只返回纯净的 JSON 字符串，不要使用 Markdown 代码块，不要包含任何解释性文字。
    
    JSON 格式必须严格遵守以下结构：
    {
      "name": "替身名字 (建议用音乐相关名词，包含中文和英文)",
      "user": "${userName}",
      "appearanceDescription": "替身的外貌视觉描述，用于AI绘图 (英文描述)",
      "abilityName": "能力名称",
      "abilityDescription": "详细的能力描述，要符合JOJO的荒诞与逻辑",
      "battleCry": "攻击时的吼叫 (如 ORA ORA)",
      "stats": {
        "power": "A-E",
        "speed": "A-E",
        "range": "A-E",
        "durability": "A-E",
        "precision": "A-E",
        "potential": "A-E"
      }
    }
  `;

  const userPrompt = `用户名字: ${userName}\n性格描述: ${personality}`;

  try {
    const completion = await client.chat.completions.create({
      model: MODEL_ID,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;
    
    if (!content) {
      throw new Error("No content received from API");
    }

    // 清理可能存在的 Markdown 标记
    const jsonStr = content.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
      const standData = JSON.parse(jsonStr);
      return standData;
    } catch (e) {
      console.error("JSON Parse Error:", e);
      console.log("Raw Content:", content);
      throw new Error("模型生成的格式不正确，无法解析为替身数据。");
    }

  } catch (error) {
    console.error("Volcengine API Error:", error);
    throw error;
  }
}

// 图片生成函数
export async function generateStandImage(description: string): Promise<string> {
  console.log("Generating image for:", description);
  
  // 使用 Pollinations.ai 生成图片
  const encodedPrompt = encodeURIComponent(`JoJo's Bizarre Adventure Stand, anime style, ${description}`);
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true&seed=${Math.random()}`;
}
