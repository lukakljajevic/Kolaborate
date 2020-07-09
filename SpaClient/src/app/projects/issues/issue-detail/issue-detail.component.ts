import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Issue } from 'src/app/models/issue';

@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.css']
})
export class IssueDetailComponent implements OnInit {

  issue: Issue;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe((data: {issue: Issue}) => {
      console.log(data.issue);
      this.issue = data.issue;
    });
  }

  formatIssueStatus(status: string) {
    const issueStatus = {
      to_do: 'To do',
      in_progress: 'In progress',
      done: 'Done'
    };
    return issueStatus[status];
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

  

}
