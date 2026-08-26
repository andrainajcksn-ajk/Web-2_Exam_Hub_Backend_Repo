--- Hello, ce fichier contient tous nos syntaxes de la création de la base de données et des entités ---

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE user_role AS ENUM ('admin', 'student');

CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(150) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          user_role NOT NULL,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE courses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        VARCHAR(20) NOT NULL UNIQUE,
  name        VARCHAR(150) NOT NULL,
  description VARCHAR(500)
);

CREATE TABLE exams (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       VARCHAR(150) NOT NULL,
  description VARCHAR(500),
  starts_at   TIMESTAMPTZ NOT NULL,
  ends_at     TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  course_id   UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
  CONSTRAINT exams_window_valid CHECK (ends_at > starts_at)
);

CREATE TABLE questions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  statement  TEXT NOT NULL,
  exam_id    UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  points     INTEGER NOT NULL CHECK (points > 0)
);

CREATE TABLE choices (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label       VARCHAR(255) NOT NULL,
  is_correct  BOOLEAN NOT NULL DEFAULT FALSE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE
);

CREATE INDEX idx_choices_question_id ON choices(question_id);

CREATE TABLE attempts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  score        INTEGER NOT NULL DEFAULT 0,
  student_id   UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  exam_id      UUID NOT NULL REFERENCES exams(id) ON DELETE RESTRICT,
  CONSTRAINT attempts_one_per_student_exam UNIQUE (student_id, exam_id)
);

CREATE TABLE answers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id  UUID NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE RESTRICT,
  choice_id   UUID REFERENCES choices(id) ON DELETE RESTRICT,
  CONSTRAINT answers_one_per_attempt_question UNIQUE (attempt_id, question_id)
);