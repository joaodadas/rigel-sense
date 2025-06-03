// src/app/api/clerk-webhook/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { userTypes, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const body = await req.json();

  if (body.type !== 'user.created') {
    return NextResponse.json({ message: 'Ignored' }, { status: 200 });
  }

  const { id: clerkUserId, email_addresses, first_name } = body.data;

  const email = email_addresses?.[0]?.email_address || '';
  const name = first_name || 'User';

  // Busca userTypeId de "doctor"
  const [doctorType] = await db
    .select()
    .from(userTypes)
    .where(eq(userTypes.name, 'doctor'));

  if (!doctorType) {
    return NextResponse.json(
      { error: 'Tipo doctor não encontrado' },
      { status: 500 }
    );
  }

  // Verifica se já existe
  const exists = await db
    .select()
    .from(users)
    .where(eq(users.clerkUserId, clerkUserId));

  if (exists.length === 0) {
    await db.insert(users).values({
      name,
      email,
      clerkUserId,
      userTypeId: doctorType.id,
    });
  }

  return NextResponse.json({ success: true });
}
