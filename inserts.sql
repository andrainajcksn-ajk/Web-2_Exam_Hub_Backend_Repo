INSERT INTO courses (code, name, description) VALUES
('WEB2', 'Programmation web', 'Bases du développement web'),
('HTML1', 'HTML et CSS', 'Introduction au HTML et CSS');

INSERT INTO exams (course_id, title, description, starts_at, ends_at) VALUES
(1, 'Quiz HTML de base', 'Un petit quiz sur les bases du HTML', NOW() - INTERVAL '1 day', NOW() + INTERVAL '7 days'),
(2, 'Quiz CSS', 'Basics CSS quiz', NOW() + INTERVAL '2 days', NOW() + INTERVAL '9 days');

INSERT INTO questions (exam_id, statement, points, position) VALUES
(1, 'Que signifie HTML ?', 2, 1),
(1, 'Que signifie CSS ?', 1, 2);

INSERT INTO choices (question_id, text, is_correct) VALUES
(1, 'HyperText Markup Language', TRUE),
(1, 'HighText Machine Language', FALSE),
(1, 'HyperText More Language', FALSE);

INSERT INTO choices (question_id, text, is_correct) VALUES
(2, 'Cascading Style Sheets', TRUE),
(2, 'Creative Style System', FALSE),
(2, 'Computer Style Sheet', FALSE);
