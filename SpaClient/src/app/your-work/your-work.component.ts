import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProjectsService } from '../services/projects.service';
import { ProjectListItem } from '../models/project-list-item';
import { IssuesService } from '../services/issues.service';
import { IssueUser } from '../models/issue-user';
import { IssueListItem } from '../models/issue-list-item';

@Component({
  selector: 'app-your-work',
  templateUrl: './your-work.component.html',
  styleUrls: ['./your-work.component.css']
})
export class YourWorkComponent implements OnInit, OnDestroy {

  recentProjectsSubscription: Subscription;
  issueCreatedSubscription: Subscription;
  recentProjects: ProjectListItem[];

  toDo: IssueListItem[] = [];
  toDoStarred: IssueListItem[] = [];
  inProgress: IssueListItem[] = [];
  inProgressStarred: IssueListItem[] = [];
  done: IssueListItem[] = [];

  constructor(private projectsService: ProjectsService,
              private issuesService: IssuesService) { }

  ngOnInit() {
    this.recentProjectsSubscription = this.projectsService.recentProjects$.subscribe(projects => {
      this.recentProjects = projects;
      console.log(projects);
    });

    this.issueCreatedSubscription = this.issuesService.createdIssue$.subscribe({
      next: response => this.toDo.push(response.issue),
      error: err => alert(err.message)
    });

    this.projectsService.getRecentProjectsLocal();
    this.issuesService.getIssues().subscribe(issueUsers => {

      console.log('ISSUE USERS');
      console.log(issueUsers);

      this.toDo.push(...issueUsers.filter(iu => !iu.isStarred && iu.issue.status === 'to_do').map(iu => iu.issue));
      this.inProgress.push(...issueUsers.filter(iu => !iu.isStarred && iu.issue.status === 'in_progress').map(iu => iu.issue));
      this.toDoStarred.push(...issueUsers.filter(iu => iu.isStarred && iu.issue.status === 'to_do').map(iu => iu.issue));
      this.inProgressStarred.push(...issueUsers.filter(iu => iu.isStarred && iu.issue.status === 'in_progress').map(iu => iu.issue));
      this.done.push(...issueUsers.filter(iu => iu.issue.status === 'done').map(iu => iu.issue));
    });
  }

  ngOnDestroy() {
    this.recentProjectsSubscription.unsubscribe();
  }

}
