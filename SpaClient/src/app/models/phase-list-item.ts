import { ProjectListItem } from './project-list-item';

export interface PhaseListItem {
  id: string;
  name: string;
  project: ProjectListItem;
}