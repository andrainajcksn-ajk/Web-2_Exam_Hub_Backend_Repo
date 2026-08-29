import { query } from '../config/db';
import { Question, QuestionInput } from '../models/questionModel';

export const questionsForExam = async (examId: number): Promise<Question[]> => {
  const { rows } = await query(
    'SELECT * FROM questions WHERE exam_id = $1 ORDER BY position, id',
    [examId]
  );
  return rows;
};

export const findChoice = async (choiceId: number) => {
  const { rows } = await query('SELECT * FROM choices WHERE id = $1', [choiceId]);
  return rows[0];
};

export const createQuestion = async (examId: number, input: QuestionInput) => {
  const { rows } = await query(
    `INSERT INTO questions (exam_id, statement, points, position)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [examId, input.statement, input.points ?? 1, input.position ?? 1]
  );
  return rows[0];
};

export const insertChoice = async (questionId: number, text: string, isCorrect: boolean) => {
  const { rows } = await query(
    'INSERT INTO choices (question_id, text, is_correct) VALUES ($1, $2, $3) RETURNING *',
    [questionId, text, isCorrect]
  );
  return rows[0];
};

export const choicesForQuestion = async (questionId: number) => {
  const { rows } = await query(
    'SELECT * FROM choices WHERE question_id = $1 ORDER BY id',
    [questionId]
  );
  return rows;
};

export const findById = async (id: number): Promise<Question | undefined> => {
  const { rows } = await query('SELECT * FROM questions WHERE id = $1', [id]);
  return rows[0];
};

export const updateQuestion = async (id: number, input: QuestionInput) => {
  const { rows } = await query(
    'UPDATE questions SET statement = $1, points = $2, position = $3 WHERE id = $4 RETURNING *',
    [input.statement, input.points ?? 1, input.position ?? 1, id]
  );
  return rows[0];
};

export const deleteChoices = async (questionId: number) => {
  await query('DELETE FROM choices WHERE question_id = $1', [questionId]);
};

export const deleteQuestion = async (id: number): Promise<boolean> => {
  const { rowCount } = await query('DELETE FROM questions WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
};

export const examOfQuestion = async (questionId: number): Promise<number | undefined> => {
  const { rows } = await query('SELECT exam_id FROM questions WHERE id = $1', [questionId]);
  return rows[0]?.exam_id;
};