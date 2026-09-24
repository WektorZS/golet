import { sql } from "drizzle-orm"

import { db } from "@/lib/db"

let schemaPromise: Promise<void> | null = null

export function ensureTripColumns() {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS teams (
          id serial PRIMARY KEY,
          name text NOT NULL UNIQUE,
          city text NOT NULL,
          country text NOT NULL,
          stadium text NOT NULL,
          logo text NOT NULL,
          trip_image_media_id integer,
          name_en text NOT NULL DEFAULT '',
          city_en text NOT NULL DEFAULT '',
          country_en text NOT NULL DEFAULT '',
          stadium_en text NOT NULL DEFAULT '',
          created_at timestamp NOT NULL DEFAULT now(),
          updated_at timestamp NOT NULL DEFAULT now()
        )
      `)
      await db.execute(sql`
        ALTER TABLE teams
          ADD COLUMN IF NOT EXISTS trip_image_media_id integer,
          ADD COLUMN IF NOT EXISTS name_en text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS city_en text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS country_en text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS stadium_en text NOT NULL DEFAULT ''
      `)
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS leagues (
          id serial PRIMARY KEY,
          name text NOT NULL UNIQUE,
          logo text NOT NULL,
          created_at timestamp NOT NULL DEFAULT now(),
          updated_at timestamp NOT NULL DEFAULT now()
        )
      `)
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS team_gallery_items (
          id serial PRIMARY KEY,
          team_id integer NOT NULL,
          media_id integer NOT NULL,
          caption text NOT NULL DEFAULT '',
          alt text NOT NULL DEFAULT '',
          sort_order integer NOT NULL DEFAULT 0,
          status text NOT NULL DEFAULT 'published',
          created_at timestamp NOT NULL DEFAULT now(),
          updated_at timestamp NOT NULL DEFAULT now(),
          UNIQUE (team_id, media_id)
        )
      `)
      await db.execute(sql`
        ALTER TABLE trips
          ADD COLUMN IF NOT EXISTS home_team_id integer,
          ADD COLUMN IF NOT EXISTS away_team_id integer,
          ADD COLUMN IF NOT EXISTS home_team text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS away_team text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS home_logo text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS away_logo text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS league_id integer,
          ADD COLUMN IF NOT EXISTS league_name text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS league_logo text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS stadium text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS match_date date,
          ADD COLUMN IF NOT EXISTS availability_status text NOT NULL DEFAULT 'available',
          ADD COLUMN IF NOT EXISTS duration_days integer NOT NULL DEFAULT 1,
          ADD COLUMN IF NOT EXISTS duration_nights integer NOT NULL DEFAULT 0,
          ADD COLUMN IF NOT EXISTS itinerary text[] NOT NULL DEFAULT '{}',
          ADD COLUMN IF NOT EXISTS hotel_info text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS flight_info text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS faq text[] NOT NULL DEFAULT '{}',
          ADD COLUMN IF NOT EXISTS package_items text[] NOT NULL DEFAULT '{}',
          ADD COLUMN IF NOT EXISTS package_variants text[] NOT NULL DEFAULT '{}',
          ADD COLUMN IF NOT EXISTS hotel_stars integer NOT NULL DEFAULT 0,
          ADD COLUMN IF NOT EXISTS hotel_board text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS room_type text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS departure_airports text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS flight_type text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS baggage_info text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS ticket_category text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS seating_info text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS cover_media_id integer,
          ADD COLUMN IF NOT EXISTS title_en text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS city_en text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS country_en text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS description_en text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS includes_en text[] NOT NULL DEFAULT '{}',
          ADD COLUMN IF NOT EXISTS itinerary_en text[] NOT NULL DEFAULT '{}',
          ADD COLUMN IF NOT EXISTS hotel_info_en text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS flight_info_en text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS faq_en text[] NOT NULL DEFAULT '{}',
          ADD COLUMN IF NOT EXISTS hotel_board_en text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS room_type_en text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS departure_airports_en text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS flight_type_en text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS baggage_info_en text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS ticket_category_en text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS seating_info_en text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS seo_title_en text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS seo_description_en text NOT NULL DEFAULT ''
      `)
      await db.execute(sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS locale text NOT NULL DEFAULT 'pl'`)
      await db.execute(sql`
        ALTER TABLE testimonials
          ADD COLUMN IF NOT EXISTS trip_name_en text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS content_en text NOT NULL DEFAULT ''
      `)
      await db.execute(sql`
        ALTER TABLE media_assets
          ADD COLUMN IF NOT EXISTS alt_en text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'other'
      `)
      await db.execute(sql`
        ALTER TABLE gallery_items
          ADD COLUMN IF NOT EXISTS title_en text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS city_en text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS alt_en text NOT NULL DEFAULT ''
      `)
      await db.execute(sql`
        ALTER TABLE trip_gallery_items
          ADD COLUMN IF NOT EXISTS caption_en text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS alt_en text NOT NULL DEFAULT ''
      `)
      await db.execute(sql`
        ALTER TABLE team_gallery_items
          ADD COLUMN IF NOT EXISTS caption_en text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS alt_en text NOT NULL DEFAULT ''
      `)
      await db.execute(sql`CREATE INDEX IF NOT EXISTS teams_trip_image_media_id_idx ON teams (trip_image_media_id)`)
      await db.execute(sql`CREATE INDEX IF NOT EXISTS trips_cover_media_id_idx ON trips (cover_media_id)`)
      await db.execute(sql`
        UPDATE trips
        SET cover_media_id = NULLIF(substring(image FROM '^/api/media/([0-9]+)$'), '')::integer
        WHERE cover_media_id IS NULL
          AND image ~ '^/api/media/[0-9]+$'
      `)
      await db.execute(sql`
        UPDATE teams AS team
        SET trip_image_media_id = source.media_id
        FROM (
          SELECT DISTINCT ON (home_team_id)
            home_team_id,
            NULLIF(substring(image FROM '^/api/media/([0-9]+)$'), '')::integer AS media_id
          FROM trips
          WHERE home_team_id IS NOT NULL
            AND image ~ '^/api/media/[0-9]+$'
          ORDER BY home_team_id, updated_at DESC, id DESC
        ) AS source
        WHERE team.id = source.home_team_id
          AND team.trip_image_media_id IS NULL
      `)
    })().catch((error) => {
      schemaPromise = null
      throw error
    })
  }

  return schemaPromise
}
