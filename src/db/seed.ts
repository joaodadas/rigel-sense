// src/db/seed.ts
import 'dotenv/config';
import { db } from './index';
import { userTypes, permissions } from './schema';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('🌱 Starting seed...');

  // USER TYPES
  const userTypesData = [
    { name: 'doctor' },
    { name: 'physiotherapist' },
    { name: 'patient' },
    { name: 'regent' },
    { name: 'student' },
  ];

  for (const type of userTypesData) {
    const exists = await db
      .select()
      .from(userTypes)
      .where(eq(userTypes.name, type.name));
    if (exists.length === 0) {
      await db.insert(userTypes).values(type);
      console.log(`✅ Created user_type: ${type.name}`);
    }
  }

  // PERMISSIONS
  const permissionsData = [
    { name: 'view', description: 'Can view treatment and measurements' },
    { name: 'edit', description: 'Can edit measurements and notes' },
    { name: 'admin', description: 'Full control over treatment and team' },
  ];

  for (const permission of permissionsData) {
    const exists = await db
      .select()
      .from(permissions)
      .where(eq(permissions.name, permission.name));
    if (exists.length === 0) {
      await db.insert(permissions).values(permission);
      console.log(`✅ Created permission: ${permission.name}`);
    }
  }

  console.log('🌱 Seed complete.');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
