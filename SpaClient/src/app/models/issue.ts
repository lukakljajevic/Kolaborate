export interface Issue {
  id: string;
  createdAt: string;
  createdBy: string;
  description: string;
  dueDate: string;
  issueType: string;
  name: string;
  phaseId: string;
  priority: number;
}