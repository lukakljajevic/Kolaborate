import { IssueListItem } from './issue-list-item';
import { ProjectListItem } from './project-list-item';

export interface Phase {
  id: string;
  name: string;
  index: number;
  issues: IssueListItem[];
  project: ProjectListItem;
}