DROP TABLE IF EXISTS jokes;

CREATE TABLE jokes (
  id SERIAL PRIMARY KEY,
  joke_id VARCHAR(255),
  type VARCHAR(255),
  setup VARCHAR(255),
  punchline VARCHAR(255)
);
