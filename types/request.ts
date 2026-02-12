export type PrintStatus = "pending" | "ready" | "collected";

export type PrintType = "black_white" | "color";

export interface PrintRequest {
  id: string;
  student_id: string;
  file_url: string;
  copies: number;
  color: PrintType;
  status: PrintStatus;
  created_at: string;
}
