import { User } from './user';

export interface Comment {
  id: string;
  text: string;
  createdBy: User;
  createdAt: Date;

  editMode: boolean;
}