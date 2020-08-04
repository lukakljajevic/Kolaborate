import { User } from './user';

export interface Attachment {
  id: string;
  url: string;
  size: number;
  createdBy: User;
}