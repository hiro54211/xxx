import OpenAI from 'openai';
import { GeneratedStand } from '../types';

// --- 调试信息 ---
console.log("正在尝试连接 AI 服务...");

// 1. 初始化客户端
const client = new OpenAI({
  apiKey: import.meta.env.VITE_ARK_API_KEY, // 读取 Key
  
  // 🔴 修改重点：直接把地址填在这里，不依赖环境变量了，确保一定连上火山引擎
  baseURL: "https://ark.cn-beijing.volces.com/api/v3", 
  
  dangerouslyAllowBrowser: true 
});

// 🔴 修改重点：直接把模型 ID 也填在这里 (或者确保 .env 里的 VITE_ARK_MODEL 是对的)
// 如果你 .env 里没改，请手动把下面的 doubao-xxxx 换成你自己的 Endpoint ID
const MODEL_ID = import.meta.env.VITE_ARK_MODEL || "doubao-seed-1-6-251015";

export async function generateStandProfile(userName: string, personality: string): Promise<GeneratedStand> {
  const systemPrompt = `
    你是一个《JOJO的奇妙冒险》替身生成器。
    请根据用户的名字和性格/氛围，通过分析其"灵魂信号"来生成一个独特的替身。
    必须严格返回合法的 JSON 格式，不要包含 markdown 代码块标记。
    JSON 结构必须包含以下字段：
    {
      "name": "替身名字",
      "user": "${userName}",
      "appearanceDescription": "替身的外貌描述 (英文)",
      "abilityName": "能力名称",
      "abilityDescription": "详细的能力描述",
      "battleCry": "攻击吼叫",
      "stats": {
        "power": "A-E", "speed": "A-E", "range": "A-E", 
        "durability": "A-E", "precision": "A-E", "potential": "A-E"
      }
    }
  `;

  try {
    const completion = await client.chat.completions.create({
      model: MODEL_ID,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `User: ${userName}, Personality: ${personality}` }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("No content");

    // 清洗 Markdown
    const jsonStr = content.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);

  } catch (error) {
    console.error("AI Error:", error);
    throw error;
  }
}

export async function generateStandImage(description: string): Promise<string> {
  // 使用免费绘图接口兜底
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(description)}?width=512&height=512&nologo=true`;
}
