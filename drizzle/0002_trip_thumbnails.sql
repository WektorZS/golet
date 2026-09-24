ALTER TABLE teams
  ADD COLUMN IF NOT EXISTS trip_thumbnail_media_id integer;

ALTER TABLE trips
  ADD COLUMN IF NOT EXISTS thumbnail_media_id integer;

CREATE INDEX IF NOT EXISTS teams_trip_thumbnail_media_id_idx
  ON teams (trip_thumbnail_media_id);

CREATE INDEX IF NOT EXISTS trips_thumbnail_media_id_idx
  ON trips (thumbnail_media_id);

UPDATE teams
SET trip_thumbnail_media_id = trip_image_media_id
WHERE trip_thumbnail_media_id IS NULL
  AND trip_image_media_id IS NOT NULL;
