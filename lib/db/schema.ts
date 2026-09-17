import { boolean, date, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  stadium: text("stadium").notNull(),
  logo: text("logo").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const leagues = pgTable("leagues", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  logo: text("logo").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

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
  homeTeamId: integer("home_team_id"),
  awayTeamId: integer("away_team_id"),
  homeTeam: text("home_team").notNull().default(""),
  awayTeam: text("away_team").notNull().default(""),
  homeLogo: text("home_logo").notNull().default(""),
  awayLogo: text("away_logo").notNull().default(""),
  leagueId: integer("league_id"),
  leagueName: text("league_name").notNull().default(""),
  leagueLogo: text("league_logo").notNull().default(""),
  stadium: text("stadium").notNull().default(""),
  matchDate: date("match_date"),
  availabilityStatus: text("availability_status").notNull().default("available"),
  durationDays: integer("duration_days").notNull().default(1),
  durationNights: integer("duration_nights").notNull().default(0),
  itinerary: text("itinerary").array().notNull().default([]),
  hotelInfo: text("hotel_info").notNull().default(""),
  flightInfo: text("flight_info").notNull().default(""),
  faq: text("faq").array().notNull().default([]),
  packageItems: text("package_items").array().notNull().default([]),
  packageVariants: text("package_variants").array().notNull().default([]),
  hotelStars: integer("hotel_stars").notNull().default(0),
  hotelBoard: text("hotel_board").notNull().default(""),
  roomType: text("room_type").notNull().default(""),
  departureAirports: text("departure_airports").notNull().default(""),
  flightType: text("flight_type").notNull().default(""),
  baggageInfo: text("baggage_info").notNull().default(""),
  ticketCategory: text("ticket_category").notNull().default(""),
  seatingInfo: text("seating_info").notNull().default(""),
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

packageVariant: text("package_variant").notNull().default(""),

departureCity: text("departure_city").notNull(),

  travelers: integer("travelers").notNull().default(1),

  message: text("message").notNull().default(""),

  status: text("status").notNull().default("new"),

  adminNote: text("admin_note").notNull().default(""),

  consentAcceptedAt: timestamp("consent_accepted_at"),

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

export const teamGalleryItems = pgTable("team_gallery_items", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").notNull(),
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

/** Hashed (never raw) fingerprints of inquiry-form submission attempts, used for cooldown/rate-limit and duplicate detection. */
export const inquiryAttempts = pgTable("inquiry_attempts", {
  id: serial("id").primaryKey(),
  ipHash: text("ip_hash").notNull(),
  emailHash: text("email_hash").notNull(),
  contentHash: text("content_hash").notNull(),
  accepted: boolean("accepted").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

/** Local cache of the channel's YouTube videos, refreshed once a day by a Vercel Cron job. */
export const youtubeVideos = pgTable("youtube_videos", {
  id: serial("id").primaryKey(),
  videoId: text("video_id").notNull().unique(),
  title: text("title").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  publishedAt: timestamp("published_at").notNull(),

  // Czy film został ręcznie wybrany do wyświetlania na stronie głównej.
  featured: boolean("featured").notNull().default(false),

  // Kolejność ręcznie wybranych filmów na stronie głównej.
  sortOrder: integer("sort_order").notNull().default(0),

  createdAt: timestamp("created_at").notNull().defaultNow(),
})
