// src/app/api/internal/register-user/route.ts
import { createClerkClient } from '@clerk/backend';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, userTypes } from '@/db/schema';
import { eq } from 'drizzle-orm';

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, userType, clerkUserId } = body;

    if (!name || !email || !userType || !clerkUserId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verifica se o usuário existe no Clerk
    try {
      await clerkClient.users.getUser(clerkUserId);
    } catch {
      return NextResponse.json(
        { error: 'User not found in Clerk' },
        { status: 404 }
      );
    }

    // Verifica se já existe no banco
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, clerkUserId));

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    const [type] = await db
      .select()
      .from(userTypes)
      .where(eq(userTypes.name, userType));

    if (!type) {
      return NextResponse.json({ error: 'Invalid user type' }, { status: 400 });
    }

    await db.insert(users).values({
      name,
      email,
      userTypeId: type.id,
      clerkUserId,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error('[Register User] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
