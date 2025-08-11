import { pgTable, text, timestamp, pgEnum, uuid, varchar, integer } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("user_role", ["buyer", "seller"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 120 }),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  expires: timestamp("expires", { withTimezone: true }).notNull(),
  sessionToken: text("session_token").notNull().unique(),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  price: varchar("price", { length: 50 }).notNull(),
  image: varchar("image", { length: 255 }),
  description: text("description"),
  categories: text("categories"),
  sellerId: uuid("seller_id").notNull().references(() => users.id),
});

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull().references(() => products.id),
  userId: uuid("user_id").references(() => users.id),
  name: varchar("name", { length: 120 }),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
