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
          created_at timestamp NOT NULL DEFAULT now(),
          updated_at timestamp NOT NULL DEFAULT now()
        )
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
          ADD COLUMN IF NOT EXISTS seating_info text NOT NULL DEFAULT ''
      `)
    })().catch((error) => {
      schemaPromise = null
      throw error
    })
  }

  return schemaPromise
}
