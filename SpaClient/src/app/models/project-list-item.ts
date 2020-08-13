import { User } from './user';
import { PhaseListItem } from './phase-list-item';
import { ProjectUser } from './project-user';

export interface ProjectListItem {
  id: string;
  name: string;
  createdBy: User;
  description: string;
  phases: {id: string, name: string}[];
  projectUsers: ProjectUser[];
}