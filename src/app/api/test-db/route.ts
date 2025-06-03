// src/app/api/test-db/route.ts
import { db } from '@/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await db.execute('SELECT 1');
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
