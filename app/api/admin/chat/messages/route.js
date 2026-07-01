import prisma from '@/lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');
    
    if (!sessionId) return new Response(JSON.stringify({ error: "Missing sessionId" }), { status: 400 });

    const messages = await prisma.chatMessage.findMany({
      where: { chatSessionId: sessionId },
      orderBy: { createdAt: 'asc' }
    });
    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch messages" }), { status: 500 });
  }
}
