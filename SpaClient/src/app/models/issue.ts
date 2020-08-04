import { Label } from './label';
import { PhaseListItem } from './phase-list-item';
import { IssueUser } from './issue-user';
import { User } from './user';
import { Comment } from './comment';
import { Attachment } from './attachment';

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
  phase: PhaseListItem;

  labels: Label[];
  issuedTo: IssueUser[];
  comments: Comment[];
  attachments: Attachment[];
}