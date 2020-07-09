import { Label } from './label';
import { ProjectListItem } from './project-list-item';
import { UserListItem } from './user-list-item';
import { PhaseListItem } from './phase-list-item';

export interface Issue {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  createdAt: string;
  issueType: string;
  priority: number;
  status: string;
  createdBy: string;
  createdByUsername: string;
  createdByFullName: string;
  phaseId: string;
  labels: Label[];
  issuedTo: UserListItem[];
  phase: PhaseListItem;
}