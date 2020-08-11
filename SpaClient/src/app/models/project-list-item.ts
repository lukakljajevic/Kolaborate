import { User } from './user';

export interface ProjectListItem {
  id: string;
  name: string;
  createdBy: User;
  description: string;
}