import { relations } from 'drizzle-orm';
import {
    boolean,
    pgEnum,
    pgTable,
    serial,
    text,
    timestamp,
    uniqueIndex,
    varchar,
} from 'drizzle-orm/pg-core';

export const userStatusEnum = pgEnum('user_status', [
    'other',
    'deleted',
    'active',
    'inactive',
    'pending',
    'banned',
    'limited',
]);

export const roles = pgEnum('roles', ['user', 'root']);

export const users = pgTable(
    'users',
    {
        id: varchar('id', {
            length: 255,
        }).primaryKey(),
        username: varchar('username', {
            length: 255,
        }).notNull(),
        fullname: varchar('fullname', {
            length: 255,
        }).notNull(),
        normalizedUsername: varchar('normalized_username', {
            length: 255,
        }).notNull(),
        email: varchar('email', {
            length: 255,
        }),
        emailVerified: boolean('email_verified').default(false),
        phoneNumber: varchar('phone_number', {
            length: 255,
        }),
        phoneNumberVerified: boolean('phone_number_verified').default(false),
        address: varchar('address', {
            length: 255,
        }),
        status: userStatusEnum('status').default('pending').notNull(),
        role: roles('role').default('user').notNull(),
        agreedToTerms: boolean('agreed_to_terms').default(false),
        hashedPassword: varchar('hashed_password').default('').notNull(),
    },
    table => {
        return {
            normalizedUsernameIdx: uniqueIndex('normalized_username_idx').on(
                table.normalizedUsername
            ),
        };
    }
);

export const emailVerificationCodes = pgTable('email_verification_codes', {
    id: serial('id').primaryKey(),
    code: varchar('code', {
        length: 8,
    }).notNull(),
    expiresAt: timestamp('expires_at', {
        withTimezone: true,
        mode: 'date',
    }).notNull(),

    userId: varchar('user_id')
        .notNull()
        .references(() => users.id),
});

export const sessions = pgTable('sessions', {
    id: text('id').primaryKey(),
    userId: varchar('user_id')
        .notNull()
        .references(() => users.id),
    expiresAt: timestamp('expires_at', {
        withTimezone: true,
        mode: 'date',
    }).notNull(),
    createdAt: timestamp('created_at', {
        withTimezone: true,
        mode: 'date',
    })
        .defaultNow()
        .notNull(),
    fresh: boolean('fresh').default(true).notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
    emailVerificationCodes: many(emailVerificationCodes),
    sessions: many(sessions),
}));

export const emailVerificationCodesRelations = relations(emailVerificationCodes, ({ one }) => ({
    users: one(users, {
        fields: [emailVerificationCodes.userId],
        references: [users.id],
    }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
    users: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}));
