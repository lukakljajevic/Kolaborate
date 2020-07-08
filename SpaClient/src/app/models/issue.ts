import { Label } from './label';
import { ProjectListItem } from './project-list-item';

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
  labels: Label[];
  project: ProjectListItem;
}