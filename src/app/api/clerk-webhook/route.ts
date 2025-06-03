import { Webhook } from 'svix';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { userTypes, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

type ClerkUserCreatedEvent = {
  type: 'user.created';
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    first_name: string;
  };
};

export async function POST(req: Request) {
  const payload = await req.text();

  const svixId = req.headers.get('svix-id')!;
  const svixTimestamp = req.headers.get('svix-timestamp')!;
  const svixSignature = req.headers.get('svix-signature')!;

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  let evt: ClerkUserCreatedEvent;

  try {
    evt = wh.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as ClerkUserCreatedEvent;
  } catch (err) {
    console.error('❌ Webhook signature verification failed', err);
    return new NextResponse('Invalid signature', { status: 400 });
  }

  if (evt.type !== 'user.created') {
    return NextResponse.json({ message: 'Ignored' }, { status: 200 });
  }

  const { id: clerkUserId, email_addresses, first_name } = evt.data;
  const email = email_addresses?.[0]?.email_address || '';
  const name = first_name || 'User';

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
