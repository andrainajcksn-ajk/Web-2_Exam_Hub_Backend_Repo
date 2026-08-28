import { Choice } from '../models/choiceModel';

export interface Question {
  id: number;
  exam_id: number;
  statement: string;
  points: number;
  position: number;
  choices?: Choice[];
}

export interface QuestionInput {
  statement: string;
  points?: number;
  position?: number;
  choices: { text: string; is_correct: boolean }[];
}
