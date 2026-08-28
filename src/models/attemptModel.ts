export interface Attempt {
  id: number;
  student_id: number;
  exam_id: number;
  score: number;
  submitted_at: Date;
}

export interface AnswerInput {
  question_id: number;
  choice_id: number;
}
