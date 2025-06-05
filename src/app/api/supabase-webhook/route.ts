// src/app/api/supabase-webhook/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { userTypes, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

type SupabaseUserCreatedEvent = {
  type: 'INSERT';
  record: {
    id: string;
    email: string;
    raw_user_meta_data?: { name?: string };
  };
};

export async function POST(req: Request) {
  const evt = (await req.json()) as SupabaseUserCreatedEvent;

  if (evt.type !== 'INSERT') {
    return NextResponse.json({ message: 'Ignored' }, { status: 200 });
  }

  const supabaseUserId = evt.record.id;
  const email = evt.record.email;
  const name = evt.record.raw_user_meta_data?.name || 'User';

  const [doctorType] = await db
    .select()
    .from(userTypes)
    .where(eq(userTypes.name, 'doctor'));

  if (!doctorType) {
    console.error('❌ Tipo de usuário "doctor" não encontrado');
    return NextResponse.json(
      { error: 'Tipo de usuário "doctor" não encontrado' },
      { status: 500 }
    );
  }

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.supabaseUserId, supabaseUserId));

  if (existingUser.length === 0) {
    await db.insert(users).values({
      name,
      email,
      supabaseUserId,
      userTypeId: doctorType.id,
    });
  }

  return NextResponse.json({ success: true });
}
