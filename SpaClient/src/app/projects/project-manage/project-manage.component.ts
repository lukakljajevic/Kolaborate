import { Component, OnInit, OnDestroy } from '@angular/core';
import { Project } from 'src/app/models/project';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ProjectUser } from 'src/app/models/project-user';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-project-manage',
  templateUrl: './project-manage.component.html',
  styleUrls: ['./project-manage.component.css']
})
export class ProjectManageComponent implements OnInit, OnDestroy {

  project: Project;
  projectUsers$: Observable<ProjectUser[]>;
  filter = new FormControl('');

  updateUserRoleSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private projectsService: ProjectsService) {
    this.projectUsers$ = this.filter.valueChanges.pipe(
      startWith(''),
      map(text => this.search(text))
    );
  }

  ngOnInit() {
    this.route.data.subscribe((data: {project: Project}) => {
      this.project = data.project;
      console.log(this.project);
    });

    this.updateUserRoleSubscription = this.projectsService.updatedUserRole$.subscribe({
      next: (response) => {
        this.project.projectUsers
          .find(pu => pu.user.id === response.userId).userRole = response.role;
        console.log(`Successfully changed the role to ${response.role}`);
      },
      error: error => alert(error)
    });

  }

  ngOnDestroy() {
    this.updateUserRoleSubscription.unsubscribe();
  }

  search(text: string): ProjectUser[] {
    return this.project.projectUsers.filter(projectUser => {
      const term = text.toLowerCase();
      return projectUser.user.fullName.toLowerCase().includes(term)
          || projectUser.user.username.includes(term);
    });
  }

  numberOfManagers() {
    return this.project.projectUsers.filter(pu => pu.userRole === 'manager').length;
  }

  updateUserRole(role: string, projectUser: ProjectUser) {
    this.projectsService.updateUserRole(this.project.id, projectUser.user.id, role);
  }

}
