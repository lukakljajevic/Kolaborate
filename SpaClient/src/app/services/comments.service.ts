import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Comment } from 'src/app/models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http: HttpClient) { }

  createComment(data: {text: string, issueId: string}) {
    return this.http.post<Comment>('http://localhost:5002/api/comments', data);
  }

  updateComment(id: string, text: string) {
    return this.http.put(`http://localhost:5002/api/comments/${id}`, {text});
  }

  deleteComment(id: string) {
    return this.http.delete(`http://localhost:5002/api/comments/${id}`);
  }

}
