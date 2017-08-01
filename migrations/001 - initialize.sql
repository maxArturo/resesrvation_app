--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE reservations (
  id   INTEGER PRIMARY KEY,
  name TEXT    NOT NULL,

);

CREATE TABLE reservation_tables (
  id          INTEGER PRIMARY KEY,
  categoryId  INTEGER NOT NULL
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE reservation_tables;
DROP TABLE reservations;