import { Label } from './label';
import { ProjectListItem } from './project-list-item';

export interface IssueListItem {
  id: string;
  name: string;
  issueType: string;
  labels: Label[];
  project: ProjectListItem;
  phaseId: string;
  status: string;
  issuedToUserIds: string[];
}