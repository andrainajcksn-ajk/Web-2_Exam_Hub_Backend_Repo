export interface Exam {
  id: number;
  title: string;
  description: string | null;
  starts_at: Date;
  ends_at: Date;
  course?: { id: number; code: string; name: string };
  question_count?: number;
  attempt_count?: number;
}
