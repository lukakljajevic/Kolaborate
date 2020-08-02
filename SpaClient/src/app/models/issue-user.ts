import { Issue } from './issue';
import { IssueListItem } from './issue-list-item';
import { User } from './user';

export interface IssueUser {
  issue: IssueListItem;
  isStarred: boolean;
  user: User;
}