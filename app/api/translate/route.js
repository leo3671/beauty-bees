import { OpenAI } from 'openai';

export async function POST(req) {
  try {
    const { text, targetLang = 'nepali' } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ translation: text }), { status: 200 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate the given English text into smooth, natural, and culturally appropriate ${targetLang}. Preserve the meaning and tone.`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.3,
    });

    const translation = response.choices[0].message.content;
    return new Response(JSON.stringify({ translation }), { status: 200 });
  } catch (error) {
    console.error("Translation Error:", error);
    return new Response(JSON.stringify({ error: "Translation failed" }), { status: 500 });
  }
}
