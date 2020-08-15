import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ProjectListItem } from '../models/project-list-item';
import { ProjectsService } from '../services/projects.service';
import { UsersService } from '../services/users.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Label } from '../models/label';
import { IssuesService } from '../services/issues.service';
import { LabelsService } from '../services/labels.service';
import { PhasesService } from '../services/phases.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {

  fullName: string;
  isAuthenticated: boolean;
  authSubscription: Subscription;
  userDataSubscription: Subscription;
  recentProjects: ProjectListItem[];

  // recentProjectsSubscription: Subscription;
  // issueCreatedSubscription: Subscription;

  issueCreateForm: FormGroup;
  minDate: Date;
  selectedLabelIds: string[] = [];
  projects: ProjectListItem[];
  labels: any[] = [];
  selectedProject: ProjectListItem;

  @ViewChild('issueCreateModal', { static: false })
  issueCreateModal: ModalDirective;

  constructor(private oidcSecurityService: OidcSecurityService,
              private projectsService: ProjectsService,
              private phasesService: PhasesService,
              private issuesService: IssuesService,
              private usersService: UsersService,
              private labelsService: LabelsService,
              public authService: AuthService) {}

  ngOnInit() {
    this.authSubscription = this.oidcSecurityService.checkAuth().subscribe(auth => {
      this.isAuthenticated = auth;
      if (this.isAuthenticated) {
        this.fullName = this.authService.fullName;
        this.projectsService.recentProjects$.subscribe(projects => {
          this.recentProjects = projects;
        });
        this.projectsService.getRecentProjects();
        this.usersService.register();

        // Call get projects
        this.projectsService.getProjects();
        // Call get labels
        this.labelsService.getLabels();
      }
    });

    this.authService.userData$
      .subscribe(data => this.fullName = data.fullName);

    this.minDate = new Date();

    this.issueCreateForm = new FormGroup({
      projectId: new FormControl('', Validators.required),
      phaseId: new FormControl('', Validators.required),
      issueType: new FormControl('task', Validators.required),
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      dueDate: new FormControl(null),
      priority: new FormControl('', Validators.required),
      labels: new FormControl(),
      issuedTo: new FormControl(null, Validators.required)
    });

    // Get projects subscription
    this.projectsService.projects$
      .subscribe(projects => this.projects = projects);

    // Get labels subscription
    this.labelsService.labels$
      .subscribe(labels => labels.forEach(l => this.labels.push({
        id: l.id,
        name: l.name,
        checked: false
      })));

    // Created issue subscription
    this.issuesService.createdIssue$.subscribe({
      next: () => {
        this.issueCreateModal.hide();
        this.resetForm();
      }
    });

    // Created project subscription
    this.projectsService.createdProject$.subscribe({
      next: () => this.projectsService.getProjects()
    });

    // Updated project subscription
    this.projectsService.updatedProject$.subscribe({
      next: data => this.projects.find(p => p.id === data.id).name = data.name
    });

    // Deleted project subscription
    this.projectsService.deletedProject$.subscribe({
      next: (id: string) => {
        const i = this.projects.findIndex(p => p.id === id);
        this.projects.splice(i, 1);
      }
    });

    // Created phase subscription
    this.phasesService.createdPhase$.subscribe({
      next: response => {
        this.projects.find(p => p.id === response.phase.project.id).phases.push({
          id: response.phase.id,
          name: response.phase.name
        });
      }
    });

    // Updated phase subscription
    this.phasesService.updatedPhase$.subscribe({
      next: response => this.projects
        .find(p => p.id === response.projectId).phases
        .find(p => p.id === response.phaseId).name = response.name
    });

    // Deleted phase subscription
    this.phasesService.deletedPhase$.subscribe({
      next: response => {
        const project = this.projects.find(p => p.id === response.projectId);
        project.phases = [];
        response.phases.forEach(p => project.phases.push({ id: p.id, name: p.name }));
      }
    });

  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

  login() {
    this.oidcSecurityService.authorize();
  }

  logout() {
    this.oidcSecurityService.logoff();
  }

  showModal(modal: ModalDirective) { modal.show(); }

  hideModal(modal: ModalDirective) { modal.hide(); }

  resetForm() {
    this.issueCreateForm.reset({
      projectId: '',
      phaseId: '',
      issueType: 'task',
      name: '',
      description: '',
      priority: ''
    });
  }

  onIssueCreateSubmit() {
    const formValue = this.issueCreateForm.getRawValue();
    formValue.description = formValue.description.replace(/\n\r?/g, '<br />');
    formValue.labels = this.selectedLabelIds;
    console.log(formValue);
    this.issuesService.createIssue(formValue);
  }

  onProjectSelected(event: any) {
    // console.log(event);
    const id = event.target.value;
    this.selectedProject = this.projects.find(p => p.id === id);
    console.log(this.selectedProject);
  }

  labelChecked(event: any) {
    if (event.target.checked) {
      this.selectedLabelIds.push(event.target.value);
    } else {
      const index = this.selectedLabelIds.findIndex(id => id === event.target.value);
      this.selectedLabelIds.splice(index, 1);
    }
  }

  resetLabels() {
    this.labels.forEach(l => l.checked = false);
  }

  onIssueCreateModalHidden() {
    this.resetForm();
    this.resetLabels();
    this.selectedProject = null;
  }

}
