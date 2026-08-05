import { boolean, date, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

export const trips = pgTable("trips", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  opponent: text("opponent").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  price: integer("price").notNull(),
  image: text("image").notNull(),
  status: text("status").notNull().default("published"),
  featured: boolean("featured").notNull().default(false),
  description: text("description").notNull().default(""),
  includes: text("includes").array().notNull().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
  seoTitle: text("seo_title").notNull().default(""),
  seoDescription: text("seo_description").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  matchName: text("match_name").notNull(),
  departureCity: text("departure_city").notNull(),
  travelers: integer("travelers").notNull().default(1),
  message: text("message").notNull().default(""),
  status: text("status").notNull().default("new"),
  adminNote: text("admin_note").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  author: text("author").notNull(),
  tripName: text("trip_name").notNull(),
  content: text("content").notNull(),
  rating: integer("rating").notNull().default(5),
  status: text("status").notNull().default("published"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const mediaAssets = pgTable("media_assets", {
  id: serial("id").primaryKey(),
  pathname: text("pathname").notNull().unique(),
  contentType: text("content_type").notNull(),
  size: integer("size").notNull().default(0),
  width: integer("width"),
  height: integer("height"),
  alt: text("alt").notNull().default(""),
  originalName: text("original_name").notNull().default(""),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const galleryItems = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  city: text("city").notNull(),
  image: text("image").notNull(),
  mediaId: integer("media_id"),
  alt: text("alt").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  status: text("status").notNull().default("published"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const tripGalleryItems = pgTable("trip_gallery_items", {
  id: serial("id").primaryKey(),
  tripId: integer("trip_id").notNull(),
  mediaId: integer("media_id").notNull(),
  caption: text("caption").notNull().default(""),
  alt: text("alt").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  status: text("status").notNull().default("published"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const adminActivity = pgTable("admin_activity", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),
  details: text("details").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})
