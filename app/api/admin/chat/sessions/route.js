import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const sessions = await prisma.chatSession.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 20
    });
    return new Response(JSON.stringify(sessions), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch sessions" }), { status: 500 });
  }
}
