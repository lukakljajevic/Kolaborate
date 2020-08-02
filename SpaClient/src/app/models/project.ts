import { Phase } from './phase';
import { ProjectUser } from './project-user';
import { User } from './user';

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  createdBy: User;

  phases: Phase[];
  projectUsers: ProjectUser[];
}