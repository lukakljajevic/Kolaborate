import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Issue } from 'src/app/models/issue';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Observable, Observer, of, from } from 'rxjs';
import { UserListItem } from 'src/app/models/user-list-item';
import { switchMap, map } from 'rxjs/operators';
import { UsersService } from 'src/app/services/users.service';
import { Project } from 'src/app/models/project';

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

  project: Project;
  userFullName = '';
  users$: Observable<UserListItem[]>;
  selectedUser = null;

  constructor(private route: ActivatedRoute,
              private usersService: UsersService) { }

  ngOnInit() {
    this.route.data.subscribe((data: {results: {issue: Issue, project: Project}}) => {
      console.log(data.results);
      this.issue = data.results.issue;
      this.project = data.results.project;
    });

    this.users$ = new Observable((observer: Observer<string>) => {
      observer.next(this.userFullName);
    }).pipe(
      switchMap((fullName: string) => {
        if (fullName) {
          return of(this.project.projectUsers).pipe(
            map(users => {
              console.log(users);
              const filteredUsers = users.filter(user => !this.issue.issuedTo.find(u => u.id === user.userId));
              console.log(filteredUsers);
              return filteredUsers;
            }
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
    // service call
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

  updatePriority(priority) {
    this.issue.priority = priority;
  }

  showModal(modal: ModalDirective) {
    modal.show();
  }

  hideModal(modal: ModalDirective) {
    modal.hide();
  }

  typeaheadOnSelect(event: any) {

  }

}
