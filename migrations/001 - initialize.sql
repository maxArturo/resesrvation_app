--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
CREATE TABLE seating_tables (
  id       INTEGER PRIMARY KEY,
  capacity INTEGER NOT NULL
);

CREATE TABLE reservations (
  id       INTEGER PRIMARY KEY,
  seating_table_id INTEGER NOT NULL,
  name     TEXT    NOT NULL,
  patron_count INTEGER NOT NULL,
  timeslot VARCHAR(10) NOT NULL,
  FOREIGN KEY (seating_table_id) REFERENCES seating_tables (id)
);

CREATE UNIQUE INDEX idx_reservations_unique_seating_table_timeslot
  ON reservations (seating_table_id, timeslot);

-- seeds
INSERT INTO seating_tables(capacity) VALUES (4);
INSERT INTO seating_tables(capacity) VALUES (4);
INSERT INTO seating_tables(capacity) VALUES (4);
INSERT INTO seating_tables(capacity) VALUES (4);
INSERT INTO seating_tables(capacity) VALUES (3);
INSERT INTO seating_tables(capacity) VALUES (2);
INSERT INTO seating_tables(capacity) VALUES (2);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------
DROP VIEW IF EXISTS available_tables;
DROP TABLE IF EXISTS seating_tables;
DROP TABLE IF EXISTS reservations;