import { Label } from './label';
import { ProjectListItem } from './project-list-item';
import { PhaseListItem } from './phase-list-item';

export interface IssueListItem {
  id: string;
  name: string;
  issueType: string;
  labels: Label[];
  phase: PhaseListItem;
  status: string;
  issuedToUserIds: string[];
}