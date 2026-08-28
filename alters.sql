ALTER TABLE users
    ADD CONSTRAINT chk_users_role CHECK (role IN ('admin', 'student'));

ALTER TABLE users
    ADD CONSTRAINT uq_users_email UNIQUE (email);

ALTER TABLE courses
    ADD CONSTRAINT uq_courses_code UNIQUE (code);

ALTER TABLE attempts
    ADD CONSTRAINT uq_attempts_student_exam UNIQUE (student_id, exam_id);

ALTER TABLE exams
    ADD CONSTRAINT fk_exams_course
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE RESTRICT;

ALTER TABLE questions
    ADD CONSTRAINT fk_questions_exam
        FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE;

ALTER TABLE choices
    ADD CONSTRAINT fk_choices_question
        FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE;

ALTER TABLE attempts
    ADD CONSTRAINT fk_attempts_student
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE RESTRICT;

ALTER TABLE attempts
    ADD CONSTRAINT fk_attempts_exam
        FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE RESTRICT;

ALTER TABLE answers
    ADD CONSTRAINT fk_answers_attempt
        FOREIGN KEY (attempt_id) REFERENCES attempts(id) ON DELETE CASCADE;

ALTER TABLE answers
    ADD CONSTRAINT fk_answers_question
        FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE RESTRICT;

ALTER TABLE answers
    ADD CONSTRAINT fk_answers_choice
        FOREIGN KEY (choice_id) REFERENCES choices(id) ON DELETE RESTRICT;

ALTER TABLE attempts
    ADD CONSTRAINT chk_attempts_score CHECK (score >= 0);

ALTER TABLE answers
    ADD CONSTRAINT uq_answers_attempt_question UNIQUE (attempt_id, question_id);
