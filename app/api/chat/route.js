import { OpenAI } from 'openai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { message, sessionId, userId, language = 'en' } = await req.json();

    // Initialize OpenAI lazily to avoid build-time errors
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'mock_key', // Fallback for build phase
    });

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

    // 4. SMART MOCK FALLBACK (If OpenAI fails or is not set up)
    const getMockReply = (userMsg, products, lang) => {
      const input = userMsg.toLowerCase();
      const isNepali = lang === 'ne';
      
      let reply = isNepali 
        ? "नमस्ते! म बी हुँ। म तपाईंलाई मद्दत गर्न यहाँ छु! 🐝" 
        : "Bzzzz! I'm Bee, your K-beauty expert! 🐝 How can I help with your routine today?";

      if (input.includes('oily') || input.includes('चिल्लो')) {
        const product = products.find(p => p.name.toLowerCase().includes('pore') || p.name.toLowerCase().includes('cleansing oil'));
        reply = isNepali 
          ? `चिल्लो छालाको लागि, म ${product?.name || 'Anua Heartleaf Oil'} सिफारिस गर्छु। यसले प्वालहरू सफा राख्न मद्दत गर्दछ! ✨`
          : `For oily skin, I highly recommend the ${product?.name || 'Anua Heartleaf Pore Control Cleansing Oil'}. It's amazing for clearing blackheads and controlling sebum! ✨`;
      } else if (input.includes('dry') || input.includes('सुक्खा')) {
        const product = products.find(p => p.name.toLowerCase().includes('hyaluronic') || p.name.toLowerCase().includes('cream'));
        reply = isNepali 
          ? `सुक्खा छालाको लागि, ${product?.name || 'Skin1004 Madagascar Centella Cream'} उत्तम छ! यसले छालालाई लामो समयसम्म हाइड्रेटेड राख्छ। 💧`
          : `For dry skin, the ${product?.name || 'Skin1004 Madagascar Centella Cream'} is a lifesaver! It provides deep hydration and repairs the skin barrier. 💧`;
      } else if (input.includes('sun') || input.includes('घाम')) {
        const product = products.find(p => p.category === 'Sunscreen');
        reply = isNepali 
          ? `घामबाट बच्न ${product?.name || 'Skin1004 Sun Serum'} प्रयोग गर्नुहोस्। यो हलुका छ र सेतो दाग छोड्दैन! ☀️`
          : `Never skip sunscreen! The ${product?.name || 'Skin1004 Hyalu-Cica Water-fit Sun Serum'} is super lightweight and leaves no white cast. ☀️`;
      } else if (input.includes('acne') || input.includes('डन्डीफोर')) {
        const product = products.find(p => p.name.toLowerCase().includes('heartleaf') || p.name.toLowerCase().includes('centella'));
        reply = isNepali 
          ? `डन्डीफोरको लागि, ${product?.name || 'Anua Heartleaf Toner'} धेरै राम्रो छ। यसले छालालाई शान्त बनाउँछ! 🌿`
          : `For acne-prone skin, the ${product?.name || 'Anua Heartleaf 77% Soothing Toner'} is a cult favorite. It calms irritation and redness instantly! 🌿`;
      } else if (input.includes('price') || input.includes('कति')) {
        reply = isNepali 
          ? "हाम्रा उत्पादनहरू रु. १३०० देखि ३३०० सम्मका छन्। तपाईं हाम्रो 'Shop' पेजमा सबै मूल्यहरू हेर्न सक्नुहुन्छ! 💰"
          : "Our premium K-beauty products range from Rs. 1,300 to Rs. 3,300. You can check all prices on our Shop page! 💰";
      }

      return reply;
    };

    const products = await prisma.product.findMany({ where: { inStock: true } });

    // Try OpenAI first, fallback to Smart Mock if quota exceeded
    try {
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('PASTE_YOUR')) {
        throw new Error('no_key');
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { 
            role: "system", 
            content: `You are "Bee", a friendly K-beauty expert for "Beauty Bees" in Nepal. 🐝
            Respond in ${language === 'ne' ? 'Nepali' : 'English'}.
            Available Products:\n${products.slice(0, 20).map(p => p.name).join(', ')}` 
          },
          { role: "user", content: message }
        ],
        max_tokens: 150
      });

      const aiReply = response.choices[0].message.content;
      await prisma.chatMessage.create({
        data: { chatSessionId: session.id, sender: 'ai', content: aiReply },
      });
      return new Response(JSON.stringify({ success: true, sessionId: session.id, reply: aiReply }), { status: 200 });

    } catch (err) {
      console.log("Using Smart Mock Fallback due to:", err.message);
      const mockReply = getMockReply(message, products, language);
      
      await prisma.chatMessage.create({
        data: { chatSessionId: session.id, sender: 'ai', content: mockReply },
      });
      return new Response(JSON.stringify({ success: true, sessionId: session.id, reply: mockReply }), { status: 200 });
    }

  } catch (error) {
    console.error("Chat Global Error:", error);
    return new Response(JSON.stringify({ error: "Failed to process chat" }), { status: 500 });
  }
}
