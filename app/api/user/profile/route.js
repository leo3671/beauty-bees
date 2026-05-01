import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import bcrypt from 'bcryptjs';

export async function PUT(request) {
  const session = await getSession();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, phone, mfaEnabled, currentPassword, newPassword } = await request.json();
    const userId = session.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const dataToUpdate = {};
    if (name) dataToUpdate.name = name;
    if (phone) dataToUpdate.phone = phone;
    if (typeof mfaEnabled === 'boolean') dataToUpdate.mfaEnabled = mfaEnabled;

    // Password change logic
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password required to change password' }, { status: 400 });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });
      }
      dataToUpdate.password = await bcrypt.hash(newPassword, 12);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: { id: true, name: true, email: true, phone: true, role: true }
    });

    // Update session
    session.user = updatedUser;
    await session.save();

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
