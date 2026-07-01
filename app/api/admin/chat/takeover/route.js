import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const { sessionId } = await req.json();
    
    const session = await prisma.chatSession.update({
      where: { id: sessionId },
      data: { status: 'admin' }
    });
    
    return new Response(JSON.stringify(session), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to take over" }), { status: 500 });
  }
}
