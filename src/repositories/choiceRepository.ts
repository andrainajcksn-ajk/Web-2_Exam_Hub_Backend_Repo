import { query } from '../config/db';


export async function choicesByQuestionIds(questionIds: number[]) {
  if (questionIds.length === 0) return {};
  const { rows } = await query(
    `SELECT * FROM choices WHERE question_id = ANY($1::int[]) ORDER BY id`,
    [questionIds]
  );
  const grouped: Record<number, any[]> = {};
  for (const c of rows) {
    if (!grouped[c.question_id]) grouped[c.question_id] = [];
    grouped[c.question_id].push(c);
  }
  return grouped;
}
