import { Label } from './label';
import { PhaseListItem } from './phase-list-item';
import { IssueUser } from './issue-user';
import { User } from './user';

export interface Issue {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  createdAt: string;
  issueType: string;
  priority: number;
  status: string;

  createdBy: User;
  labels: Label[];
  issuedTo: IssueUser[];
  phase: PhaseListItem;
}