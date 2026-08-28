import { query } from '../config/db';

export async function insertAnswer(
  attemptId: number,
  questionId: number,
  choiceId: number
) {
  await query(
    'INSERT INTO answers (attempt_id, question_id, choice_id) VALUES ($1, $2, $3)',
    [attemptId, questionId, choiceId]
  );
}

export async function answersForAttempt(attemptId: number) {
  const { rows } = await query('SELECT * FROM answers WHERE attempt_id = $1', [attemptId]);
  return rows;
}
