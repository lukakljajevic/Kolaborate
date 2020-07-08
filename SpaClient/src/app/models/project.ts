import { Phase } from './phase';
import { ProjectUser } from './project-user';

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  completedOn: string;
  createdBy: string;
  createdByFullName: string;
  phases: Phase[];
  projectUsers: ProjectUser[];
}