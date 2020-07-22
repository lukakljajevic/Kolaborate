import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Issue } from 'src/app/models/issue';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Observable, Observer, of, from } from 'rxjs';
import { UserListItem } from 'src/app/models/user-list-item';
import { switchMap, map } from 'rxjs/operators';
import { UsersService } from 'src/app/services/users.service';
import { Project } from 'src/app/models/project';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { IssuesService } from 'src/app/services/issues.service';
import { AuthService } from 'src/app/services/auth.service';
import { IssueUser } from 'src/app/models/issue-user';

@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.css']
})
export class IssueDetailComponent implements OnInit {

  issue: Issue;
  issueStatus = {
    to_do: 'To do',
    in_progress: 'In progress',
    done: 'Done'
  };

  issuePriority = {
    1: 'Lowest',
    2: 'Low',
    3: 'Medium',
    4: 'High',
    5: 'Highest'
  };

  issueIcon = {
    1: 'arrow-down',
    2: 'arrow-down',
    3: 'arrow-up',
    4: 'arrow-up',
    5: 'arrow-up'
  };

  isStarred: boolean;
  issuedToCurrentUser: boolean;

  project: Project;
  userFullName = '';
  users$: Observable<UserListItem[]>;
  selectedUser: {userId: string, username: string, userFullName: string} = {userId: '', username: '', userFullName: ''};

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private issuesService: IssuesService) { }

  ngOnInit() {
    this.route.data.subscribe((data: {results: {issue: Issue, project: Project}}) => {
      console.log(data.results);
      this.issue = data.results.issue;
      this.project = data.results.project;

      const index = this.issue.issuedTo.findIndex(user => user.id === this.authService.userId)
      this.issuedToCurrentUser = index > -1 ? true : false;

      if (this.issuedToCurrentUser) {
        this.isStarred = this.issue.issuedTo[index].isStarred;
      }
    });

    this.users$ = new Observable((observer: Observer<string>) => {
      observer.next(this.userFullName);
    }).pipe(
      switchMap((fullName: string) => {
        if (fullName) {
          return of(this.project.projectUsers).pipe(
            map(users => users.filter(user => !this.issue.issuedTo.find(u => u.id === user.userId))
          ));
        }
        return of([]);
      })
    );

  }

  formatIssueStatus(status: string) {
    return this.issueStatus[status];
  }

  generateAvailableIssueStatuses() {
    const issueStatuses = ['to_do', 'in_progress', 'done'];
    const index = issueStatuses.findIndex(s => s === this.issue.status);
    issueStatuses.splice(index, 1);
    return issueStatuses;
  }

  updateStatus(status: string) {
    this.issue.status = status;
    this.issuesService.updateStatus(this.issue.id, this.issue.status);
  }

  getInitials(fullName: string) {
    const nameArray = fullName.split(' ');
    return nameArray[0].charAt(0) + nameArray[nameArray.length - 1].charAt(0);
  }

  generateAvailableIssuePriorities() {
    const issuePriorities = [1, 2, 3, 4, 5];
    const index = issuePriorities.findIndex(p => p === this.issue.priority);
    issuePriorities.splice(index, 1);
    return issuePriorities;
  }

  updatePriority(priority: number) {
    this.issue.priority = priority;
    this.issuesService.updatePriority(this.issue.id, this.issue.priority);
  }

  showModal(modal: ModalDirective) {
    modal.show();
  }

  hideModal(modal: ModalDirective) {
    modal.hide();
  }

  typeaheadOnSelect(e: TypeaheadMatch) {
    this.selectedUser.userId = e.item.userId;
    this.selectedUser.username = e.item.username;
    this.selectedUser.userFullName = e.item.userFullName;
  }

  showAddAssigneeModal(assigneesModal: ModalDirective, addAssigneeModal: ModalDirective) {
    this.showModal(addAssigneeModal);
    this.hideModal(assigneesModal);
  }

  addAssignee(modal: ModalDirective) {
    this.issuesService.addAssignee(this.issue.id, this.selectedUser, this.project.id)
      .subscribe({
        next: () => {
          this.issue.issuedTo.push({
            id: this.selectedUser.userId,
            username: this.selectedUser.username,
            fullName: this.selectedUser.userFullName,
            isStarred: false,
            issue: null
          });
          this.hideModal(modal);
          this.selectedUser = {userId: '', username: '', userFullName: ''};
          this.userFullName = '';
        },
        error: (err: {message: string}) => alert(err.message)
      });
  }

  updateStarred() {
    this.isStarred = !this.isStarred;
    this.issuesService.updateIsStarred(this.issue.id, this.isStarred);
  }

  deleteAssignee(assignee: IssueUser, modal: ModalDirective) {
    if (this.issue.issuedTo.length === 1) {
      alert('You are not allowed to remove last issued to user.');
      return modal.hide();
    }
    console.log(assignee);
    this.issuesService.deleteAssignee(this.issue.id, assignee.id)
      .subscribe({
        next: () => {
          const index = this.issue.issuedTo.findIndex(iu => iu.id === assignee.id);
          this.issue.issuedTo.splice(index, 1);
          modal.hide();
        }
      });
  }

}
