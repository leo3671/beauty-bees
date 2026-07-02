import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createSupabaseServerClient } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function PUT(request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser();

    if (error || !supabaseUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, phone, mfaEnabled, currentPassword, newPassword } = await request.json();
    const userId = supabaseUser.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const dataToUpdate = {};
    if (name) dataToUpdate.name = name;
    if (phone) dataToUpdate.phone = phone;
    if (typeof mfaEnabled === 'boolean') dataToUpdate.mfaEnabled = mfaEnabled;

    // Password change logic (Local DB representation & Supabase sync)
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password required to change password' }, { status: 400 });
      }

      // Verify old password in Supabase Auth first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: supabaseUser.email,
        password: currentPassword
      });

      if (signInError) {
        return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });
      }

      // Update password in Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 400 });
      }

      // Also hash for local compatibility if required, otherwise set placeholder
      dataToUpdate.password = await bcrypt.hash(newPassword, 12);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: { id: true, name: true, email: true, phone: true, role: true }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
