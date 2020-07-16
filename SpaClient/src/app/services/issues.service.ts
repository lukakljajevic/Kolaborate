import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Label } from '../models/label';
import { Observable, Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { IssueListItem } from '../models/issue-list-item';
import { IssueUser } from '../models/issue-user';
import { Issue } from '../models/issue';

@Injectable({
  providedIn: 'root'
})
export class IssuesService {

  private createdIssue: Subject<{message: string, issue: IssueListItem}> = new Subject();
  private updatedIssue: Subject<{message: string, issue: IssueListItem}> = new Subject();
  private deletedIssue: Subject<{message: string, issue: IssueListItem}> = new Subject();

  constructor(private http: HttpClient,
              private datepipe: DatePipe) { }

  get createdIssue$() { return this.createdIssue.asObservable(); }
  get updatedIssue$() { return this.updatedIssue.asObservable(); }
  get deletedIssue$() { return this.deletedIssue.asObservable(); }

  getLabels(): Observable<Label[]> {
    return this.http.get<Label[]>(`http://localhost:5002/api/labels`);
  }

  createIssue(formData: any) {
    if (formData.dueDate) {
      formData.dueDate = this.datepipe.transform(formData.dueDate, 'yyyy-MM-dd');
    }
    formData.priority = +formData.priority;

    this.http.post<{message: string, issue: IssueListItem}>(`http://localhost:5002/api/issues`, formData)
      .subscribe({
        next: response => this.createdIssue.next(response),
        error: (err: {message: string}) => this.createdIssue.error(err)
      });
  }

  getIssues() {
    return this.http.get<IssueUser[]>('http://localhost:5002/api/issues');
  }

  getIssue(id: string) {
    return this.http.get<Issue>(`http://localhost:5002/api/issues/${id}`);
  }

  deleteIssue(issue: IssueListItem) {
    this.http.delete<{message: string}>(`http://localhost:5002/api/issues/${issue.id}`)
      .subscribe({
        next: response => this.deletedIssue.next({
          issue,
          message: response.message
        }),
        error: (err: {message: string}) => this.deletedIssue.error(err)
      });
  }

  addLabels(formData: {issueId: string, labels: string[]}) {
    this.http.put<{
      message: string,
      issue: IssueListItem
    }>(`http://localhost:5002/api/issues/${formData.issueId}`, {labels: formData.labels})
      .subscribe({
        next: response => {
          this.updatedIssue.next(response);
        },
        error: err => this.updatedIssue.error(err)
      });
  }

  addAssignee(id: string, user: {userId: string, username: string, userFullName: string}, projectId: string) {
    return this.http.post(`http://localhost:5002/api/issues/${id}/assign`, {...user, projectId});
  }

  updateStatus(id: string, status: string) {
    this.http.put(`http://localhost:5002/api/issues/${id}`, {status})
      .subscribe({
        next: () => console.log('updated status'),
        error: (err: {message: string}) => alert(err.message)
      });
  }

  updatePriority(id: string, priority: number) {
    this.http.put(`http://localhost:5002/api/issues/${id}`, {priority})
      .subscribe({
        next: () => console.log('updated priority'),
        error: (err: {message: string}) => alert(err.message)
      });
  }

  updateIsStarred(id: string, isStarred: boolean) {
    this.http.post(`http://localhost:5002/api/issues/${id}/starred`, {isStarred})
      .subscribe({
        next: () => console.log('updated is starred'),
        error: (err: {message: string}) => alert(err.message)
      });
  }

  deleteAssignee(issueId: string, assigneeId: string) {
    return this.http.delete(`http://localhost:5002/api/issues/${issueId}/assignee/${assigneeId}`);
  }

}
