// src/app/api/internal/register-user/route.ts
import { createClerkClient } from '@clerk/backend';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, userTypes } from '@/db/schema';
import { eq } from 'drizzle-orm';

const clerkClient = createClerkClient({
  secretKey: 'sk_live_cD3yp5xjQlcuMaID0QQj424k0GEt35aX3RJkmdIxw',
  publishableKey: 'pk_live_Y2xlcmsucm1nZWxzZW5zSjtb20k',
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

    console.log('[Register User] Insert completed');

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    if (err instanceof Error) {
      console.error(
        '[Register User] Unexpected error:',
        err.message,
        err.stack
      );
    } else {
      console.error('[Register User] Unexpected error:', err);
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
