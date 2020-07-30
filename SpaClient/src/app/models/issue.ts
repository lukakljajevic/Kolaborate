import { Label } from './label';
import { ProjectListItem } from './project-list-item';
import { UserListItem } from './user-list-item';
import { PhaseListItem } from './phase-list-item';
import { IssueUser } from './issue-user';

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
  labels: Label[];
  issuedTo: IssueUser[];
  phase: PhaseListItem;
}