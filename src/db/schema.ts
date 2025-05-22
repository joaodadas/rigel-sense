import {
  pgTable,
  uuid,
  text,
  timestamp,
  date,
  jsonb,
  numeric,
  boolean,
} from 'drizzle-orm/pg-core';

// USER TYPES
export const userTypes = pgTable('user_types', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
});

// USERS
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  crm: text('crm'),
  userTypeId: uuid('user_type_id')
    .notNull()
    .references(() => userTypes.id),
  phone: text('phone'),
  institution: text('institution'),
  gender: text('gender'),
  birthDate: date('birth_date'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// PERMISSIONS
export const permissions = pgTable('permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  description: text('description'),
});

// TREATMENTS
export const treatments = pgTable('treatments', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdById: uuid('created_by_id')
    .notNull()
    .references(() => users.id),
  responsibleDoctorId: uuid('responsible_doctor_id').references(() => users.id),
  title: text('title'),
  description: text('description'),
  startDate: date('start_date'),
  endDate: date('end_date'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// USER_TREATMENTS
export const userTreatments = pgTable('user_treatments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  treatmentId: uuid('treatment_id')
    .notNull()
    .references(() => treatments.id),
  permissionId: uuid('permission_id')
    .notNull()
    .references(() => permissions.id),
  addedById: uuid('added_by_id').references(() => users.id),
  status: text('status').default('active'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// MEASUREMENTS
export const measurements = pgTable('measurements', {
  id: uuid('id').primaryKey().defaultRandom(),
  treatmentId: uuid('treatment_id')
    .notNull()
    .references(() => treatments.id),
  measuredById: uuid('measured_by_id')
    .notNull()
    .references(() => users.id),
  measuredAt: timestamp('measured_at').notNull(),
  sensorValues: numeric('sensor_values').array().notNull(),
  sensorLocations: text('sensor_locations').array().notNull(),
  circumferences: jsonb('circumferences').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});
