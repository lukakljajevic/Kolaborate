import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { ProjectsService } from 'src/app/services/projects.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/models/project';
import { Subscription, Observable, Observer, noop, of } from 'rxjs';
import { Label } from 'src/app/models/label';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { UserListItem } from 'src/app/models/user-list-item';
import { UsersService } from 'src/app/services/users.service';
import { switchMap, tap, filter, map } from 'rxjs/operators';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectUser } from 'src/app/models/project-user';
import { Phase } from 'src/app/models/phase';
import { PhasesService } from 'src/app/services/phases.service';
import { IssuesService } from 'src/app/services/issues.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  project: Project;
  previewPhases: Phase[];
  labels: Label[] = [];
  dragModeEnabled = false;
  userFullNameSelected = '';
  users$: Observable<UserListItem[]>;
  errorMessage: string;
  selectedUser: {id: string, username: string, fullName: string} = {id: '', username: '', fullName: ''};
  selectedUserRole = 'user';
  currentUserRole: string;

  // Filtering
  searchTerm = '';
  issueType = '';
  label = '';
  filterUserId = '';

  @ViewChild('inviteModal', {static: false})
  inviteModal: ModalDirective;
  @ViewChild('deleteModal', {static: false})
  deleteModal: ModalDirective;

  createdPhaseSubscription: Subscription;
  updatedPhaseSubscription: Subscription;
  deletedPhaseSubscription: Subscription;
  createdIssueSubscription: Subscription;
  updatedIssueSubscription: Subscription;
  deletedIssueSubscription: Subscription;

  constructor(private projectsService: ProjectsService,
              private phasesService: PhasesService,
              private issuesService: IssuesService,
              private route: ActivatedRoute,
              private usersService: UsersService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.route.data.subscribe((data: {project: Project}) => {
      console.log(data.project);
      this.project = data.project;
      this.initializeLabelsFilter();
      this.previewPhases = JSON.parse(JSON.stringify(data.project.phases));
      this.projectsService.getRecentProjects();
      this.currentUserRole = this.project.projectUsers.find(pu => pu.userId === this.authService.userId).userRole;
    });

    this.users$ = new Observable((observer: Observer<string>) => {
      observer.next(this.userFullNameSelected);
    }).pipe(
      switchMap((query: string) => {
        if (query) {
          return this.usersService.getUsers(query).pipe(
            map(items => items.filter(u => !this.project.projectUsers.find(pu => pu.userId === u.id))),
            tap(() => noop, err => {
              this.errorMessage = err && err.message || 'Something goes wrong';
            })
          );
        }
        return of([]);
      })
    );

    // Phase create subscription
    this.createdPhaseSubscription = this.phasesService.createdPhase$.subscribe({
      next: response => {
        this.project.phases.push(response.phase);
        this.filterIssues();
      },
        error: (err: {message: string}) => alert(err.message)
    });

    // Phase update subscription
    this.updatedPhaseSubscription = this.phasesService.updatedPhases$.subscribe(phases => {
      this.project.phases = phases;
    });

    // Phase delete subscription
    this.deletedPhaseSubscription = this.phasesService.deletedPhase$.subscribe({
      next: response => {
        this.project.phases = response.phases;
        this.filterIssues();
        this.initializeLabelsFilter();
      },
      error: err => alert(err.message)
    });

    // Issue create subscription
    this.createdIssueSubscription = this.issuesService.createdIssue$.subscribe({
      next: response => {
        const phase = this.project.phases.find(p => p.id === response.issue.phaseId);
        phase.issues.push(response.issue);
        this.filterIssues();
        response.issue.labels.forEach(label => {
          if (this.labels.findIndex(l => l.id === label.id) === -1) {
            this.labels.push(label);
          }
        });
      },
      error: err => alert(err.message)
    });

    // Issue update subscription
    this.updatedIssueSubscription = this.issuesService.updatedIssue$.subscribe({
      next: response => {
        const phase = this.project.phases.find(p => p.id === response.issue.phaseId);
        const index = phase.issues.findIndex(i => i.id === response.issue.id);
        phase.issues[index] = response.issue;
        this.initializeLabelsFilter();
        this.filterIssues();
      },
      error: err => alert(err.message)
    });

    // Issue delete subscription
    this.deletedIssueSubscription = this.issuesService.deletedIssue$.subscribe({
      next: response => {
        const phase = this.project.phases.find(p => p.id === response.issue.phaseId);
        const issueIndex = phase.issues.findIndex(i => i.id === response.issue.id);
        phase.issues.splice(issueIndex, 1);
        this.filterIssues();
        this.initializeLabelsFilter();
      },
      error: err => alert(err.message)
    });
  }

  ngOnDestroy() {
    this.createdPhaseSubscription.unsubscribe();
    this.updatedPhaseSubscription.unsubscribe();
    this.deletedPhaseSubscription.unsubscribe();
    this.createdIssueSubscription.unsubscribe();
    this.updatedIssueSubscription.unsubscribe();
    this.deletedIssueSubscription.unsubscribe();
  }

  initializeLabelsFilter() {
    this.labels = [];
    this.project.phases.forEach(phase => {
      phase.issues.forEach(issue => {
        issue.labels.forEach(label => {
          if (this.labels.findIndex(l => l.id === label.id) === -1) {
            this.labels.push(label);
          }
        });
      });
    });
  }

  openModal(modal: ModalDirective) {
    modal.show();
  }

  closeModal(modal: ModalDirective) {
    modal.hide();
  }


  inviteUser() {
    const params = {
      projectId: this.project.id,
      userId: this.selectedUser.id,
      username: this.selectedUser.username,
      userFullName: this.selectedUser.fullName,
      userRole: this.selectedUserRole
    };

    console.log(params);

    this.projectsService.addUser(params)
      .subscribe((response: {message: string, projectUser: ProjectUser}) => {
        alert(response.message);
        this.project.projectUsers.push(response.projectUser);
        this.closeModal(this.inviteModal);
      });
  }

  typeaheadOnSelect(e: TypeaheadMatch) {
    this.selectedUser.id = e.item.id;
    this.selectedUser.username = e.item.userName;
    this.selectedUser.fullName = e.item.fullName;
  }

  deleteProject() {
    this.projectsService.deleteProject(this.project.id).subscribe(response => {
      alert(response.message);
      this.projectsService.getRecentProjects();
      this.closeModal(this.deleteModal);
      this.router.navigate(['/your-work']);
    }, error => {
      alert(error.message);
    });
  }

  search(event: any) {
    if (event.target.name === 'issueType') {
      this.issueType = event.target.value;
    } else if (event.target.name === 'label') {
      this.label = event.target.value;
    }
    this.filterIssues();
  }

  filterIssues() {
    this.previewPhases = JSON.parse(JSON.stringify(this.project.phases));
    this.previewPhases.forEach(phase => {
      phase.issues = phase.issues.filter(issue => {
        let result = true;
        if (this.searchTerm.trim() !== '') {
          result = result && issue.name.toLowerCase().startsWith(this.searchTerm);
        }
        if (this.issueType !== '') {
          result = result && issue.issueType === this.issueType;
        }
        if (this.label !== '') {
          result = result && issue.labels.findIndex(label => label.name === this.label) > -1;
        }
        if (this.filterUserId !== '') {
          result = result && issue.issuedToUserIds.findIndex(id => id === this.filterUserId) > -1;
        }
        return result;
      });
    });
  }

  resetFilters() {
    this.searchTerm = '';
    this.issueType = '';
    this.label = '';
    this.filterUserId = '';
    this.filterIssues();
  }

  viewResetFilter(): boolean {
    return this.searchTerm !== '' || this.issueType !== '' || this.label !== '' || this.filterUserId !== '';
  }

  getInitials(fullName: string) {
    const namesArray = fullName.split(' ');
    if (namesArray.length === 1) {
      return `${namesArray[0].charAt(0)}`;
    }
    return `${namesArray[0].charAt(0)}${namesArray[namesArray.length - 1].charAt(0)}`;
  }

  setFilterUserId(id: string) {
    this.filterUserId = id;
    this.filterIssues();
  }

}
