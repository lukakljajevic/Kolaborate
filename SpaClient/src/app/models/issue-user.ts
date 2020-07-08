import { Issue } from './issue';
import { IssueListItem } from './issue-list-item';

export interface IssueUser {
  issue: IssueListItem;
  isStarred: boolean;
}