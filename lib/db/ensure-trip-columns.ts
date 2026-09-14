import { sql } from "drizzle-orm"

import { db } from "@/lib/db"

let schemaPromise: Promise<void> | null = null

export function ensureTripColumns() {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      await db.execute(sql`
        ALTER TABLE trips
          ADD COLUMN IF NOT EXISTS home_team text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS away_team text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS home_logo text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS away_logo text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS stadium text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS match_date date,
          ADD COLUMN IF NOT EXISTS availability_status text NOT NULL DEFAULT 'available',
          ADD COLUMN IF NOT EXISTS duration_days integer NOT NULL DEFAULT 1,
          ADD COLUMN IF NOT EXISTS duration_nights integer NOT NULL DEFAULT 0,
          ADD COLUMN IF NOT EXISTS itinerary text[] NOT NULL DEFAULT '{}',
          ADD COLUMN IF NOT EXISTS hotel_info text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS flight_info text NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS faq text[] NOT NULL DEFAULT '{}'
      `)
    })().catch((error) => {
      schemaPromise = null
      throw error
    })
  }

  return schemaPromise
}

