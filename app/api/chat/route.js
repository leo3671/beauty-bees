import { OpenAI } from 'openai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message, sessionId, userId, language = 'en' } = await req.json();

    // 1. Get or Create Session
    let session = await prisma.chatSession.findUnique({
      where: { id: sessionId || 'new' },
    });

    if (!session) {
      session = await prisma.chatSession.create({
        data: { userId, status: 'ai' },
      });
    }

    // 2. Save User Message
    await prisma.chatMessage.create({
      data: {
        chatSessionId: session.id,
        sender: 'user',
        content: message,
      },
    });

    // 3. If Admin has taken over, don't reply with AI
    if (session.status === 'admin') {
      return new Response(JSON.stringify({ 
        success: true, 
        sessionId: session.id, 
        message: "Waiting for admin response..." 
      }), { status: 200 });
    }

    // 4. Generate AI Response
    if (!process.env.OPENAI_API_KEY) {
      const mockReply = language === 'en' 
        ? "Bzzzz! I am Bee, your K-beauty expert! 🐝 I'd love to help, but my AI brain needs an API key to think. For now, I recommend the Anua Cleansing Oil for clear pores!"
        : "बज्ज्ज्ज्! म बी हुँ, तपाईंको के-ब्युटी विशेषज्ञ! 🐝 म मद्दत गर्न चाहन्छु, तर मेरो एआई दिमागलाई सोच्नको लागि एपीआई कुञ्जी चाहिन्छ। अहिलेको लागि, म सफा प्वालहरूको लागि अनुआ क्लिन्जिङ आयल सिफारिस गर्छु!";
      await prisma.chatMessage.create({
        data: {
          chatSessionId: session.id,
          sender: 'ai',
          content: mockReply,
        },
      });
      return new Response(JSON.stringify({ success: true, sessionId: session.id, reply: mockReply }), { status: 200 });
    }

    const products = await prisma.product.findMany({ where: { inStock: true } });
    const productContext = products.map(p => `${p.name} (${p.brand}): ${p.description} - Rs. ${p.price}`).join('\n');

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: `You are "Bee", a friendly and helpful K-beauty expert assistant for the store "Beauty Bees" in Nepal. Use emojis like 🐝. Help customers with product recommendations and skincare routines. 
          Respond in ${language === 'ne' ? 'Nepali' : 'English'}. 
          Here are the products we have:\n${productContext}` 
        },
        { role: "user", content: message }
      ],
    });

    const aiReply = response.choices[0].message.content;

    // 5. Save AI Response
    await prisma.chatMessage.create({
      data: {
        chatSessionId: session.id,
        sender: 'ai',
        content: aiReply,
      },
    });

    return new Response(JSON.stringify({ success: true, sessionId: session.id, reply: aiReply }), { status: 200 });

  } catch (error) {
    console.error("Chat Error:", error);
    return new Response(JSON.stringify({ error: "Failed to process chat" }), { status: 500 });
  }
}
