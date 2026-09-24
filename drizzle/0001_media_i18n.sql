ALTER TABLE teams
  ADD COLUMN IF NOT EXISTS trip_image_media_id integer,
  ADD COLUMN IF NOT EXISTS name_en text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS city_en text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS country_en text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS stadium_en text NOT NULL DEFAULT '';

ALTER TABLE trips
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
  ADD COLUMN IF NOT EXISTS seo_description_en text NOT NULL DEFAULT '';

ALTER TABLE inquiries
  ADD COLUMN IF NOT EXISTS locale text NOT NULL DEFAULT 'pl';

ALTER TABLE testimonials
  ADD COLUMN IF NOT EXISTS trip_name_en text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS content_en text NOT NULL DEFAULT '';

ALTER TABLE media_assets
  ADD COLUMN IF NOT EXISTS alt_en text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'other';

ALTER TABLE gallery_items
  ADD COLUMN IF NOT EXISTS title_en text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS city_en text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS alt_en text NOT NULL DEFAULT '';

ALTER TABLE trip_gallery_items
  ADD COLUMN IF NOT EXISTS caption_en text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS alt_en text NOT NULL DEFAULT '';

ALTER TABLE team_gallery_items
  ADD COLUMN IF NOT EXISTS caption_en text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS alt_en text NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS teams_trip_image_media_id_idx ON teams (trip_image_media_id);
CREATE INDEX IF NOT EXISTS trips_cover_media_id_idx ON trips (cover_media_id);

UPDATE trips
SET cover_media_id = NULLIF(substring(image FROM '^/api/media/([0-9]+)$'), '')::integer
WHERE cover_media_id IS NULL
  AND image ~ '^/api/media/[0-9]+$';

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
  AND team.trip_image_media_id IS NULL;
