import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { sessionId, content } = await req.json();
    
    const message = await prisma.chatMessage.create({
      data: {
        chatSessionId: sessionId,
        sender: 'admin',
        content
      }
    });
    
    return new Response(JSON.stringify(message), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to send reply" }), { status: 500 });
  }
}
