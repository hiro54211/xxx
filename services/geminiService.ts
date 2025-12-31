import OpenAI from 'openai';
import { GeneratedStand } from '../types';

// >>> 新增这两行调试代码 <<<
console.log("当前使用的 API Key:", import.meta.env.VITE_ARK_API_KEY); 
console.log("当前使用的 Base URL:", import.meta.env.VITE_ARK_BASE_URL); 

// 初始化客户端
const client = new OpenAI({
  apiKey: import.meta.env.VITE_ARK_API_KEY,
  baseURL: import.meta.env.VITE_ARK_BASE_URL,
  dangerouslyAllowBrowser: true
});
// ... 后面的代码不变
  // 定义提示词，强制模型输出 JSON
  const systemPrompt = `
    你是一个《JOJO的奇妙冒险》替身生成器。
    请根据用户的名字和性格/氛围，通过分析其"灵魂信号"来生成一个独特的替身。
    
    【重要】你必须严格只返回纯净的 JSON 字符串，不要使用 Markdown 代码块（如 \`\`\`json），不要包含任何解释性文字。
    
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
    // 2. 调用 API (对应 Python 代码中的 client.chat.completions.create)
    const completion = await client.chat.completions.create({
      model: MODEL_ID, // 使用 .env.local 中的 endpoint ID
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7, // 控制随机性
      // 如果你的模型接入点支持 reasoning_effort (如 o1 类模型)，可以取消下面注释
      // reasoning_effort: "medium" 
    });

    const content = completion.choices[0].message.content;
    
    if (!content) {
      throw new Error("No content received from API");
    }

    // 清理可能存在的 Markdown 标记，防止 JSON 解析失败
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
  // 注意：你提供的 Python 代码使用的是豆包语言模型 (Doubao)，它通常不具备直接生成图片 API (Image Generation)。
  // 它具备"看图"能力，但不一定具备"画图"能力。
  // 为了让你的 App 不报错，这里我们使用一个免费的第三方绘图接口作为兜底。
  
  // 如果你购买了火山引擎的"文生图"服务 (如 CV 模型)，需要查阅专门的 CV API 文档进行替换。
  
  console.log("Generating image for:", description);
  
  // 使用 Pollinations.ai (免费且不需要 Key) 根据描述生成 JOJO 风格图片
  const encodedPrompt = encodeURIComponent(`JoJo's Bizarre Adventure Stand, anime style, ${description}`);
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true&seed=${Math.random()}`;
}