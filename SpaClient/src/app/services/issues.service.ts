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
  private deletedIssue: Subject<{message: string, issue: IssueListItem}> = new Subject();

  constructor(private http: HttpClient,
              private datepipe: DatePipe) { }

  get createdIssue$() { return this.createdIssue.asObservable(); }
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

}
