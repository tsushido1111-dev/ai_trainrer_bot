const TelegramBot = require("node-telegram-bot-api");
const OpenAI = require("openai");

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `
Ты — профессиональный ИИ фитнес-тренер.

ПРАВИЛА:
- Отвечай ТОЛЬКО на темы тренировок, упражнений, питания, режима и восстановления
- Если вопрос не по теме — вежливо откажись
- Всегда уточняй: возраст, рост, вес, цель
- Составляй понятные планы тренировок и питания
`;

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: text }
      ]
    });

    bot.sendMessage(chatId, response.choices[0].message.content);
  } catch (e) {
    bot.sendMessage(chatId, "Ошибка. Попробуй позже.");
  }
});
