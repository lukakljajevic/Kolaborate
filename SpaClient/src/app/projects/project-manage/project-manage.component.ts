import { Component, OnInit, OnDestroy, ViewChild, AfterViewChecked, AfterViewInit, AfterContentInit } from '@angular/core';
import { Project } from 'src/app/models/project';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, Subject } from 'rxjs';
import { ProjectUser } from 'src/app/models/project-user';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { ProjectsService } from 'src/app/services/projects.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-project-manage',
  templateUrl: './project-manage.component.html',
  styleUrls: ['./project-manage.component.css']
})
export class ProjectManageComponent implements OnInit, OnDestroy {

  project: Project;
  projectUsersSubject: Subject<ProjectUser[]> = new Subject<ProjectUser[]>();
  // projectUsers$: Observable<ProjectUser[]>;
  projectUsers$: Observable<ProjectUser[]> = this.projectUsersSubject.asObservable();
  filter = new FormControl('');

  updateUserRoleSubscription: Subscription;
  removedUserSubscription: Subscription;

  userToRemove: ProjectUser;
  @ViewChild('deleteModal', { static: false })
  deleteModal: ModalDirective;

  constructor(private route: ActivatedRoute,
              private projectsService: ProjectsService) {}

  ngOnInit() {
    this.route.data.subscribe((data: {project: Project}) => {
      this.project = data.project;
      console.log(this.project);
      setTimeout(() => {
        this.projectUsersSubject.next(this.project.projectUsers);
      }, 0);
    });

    this.updateUserRoleSubscription = this.projectsService.updatedUserRole$.subscribe({
      next: (response) => {
        this.project.projectUsers
          .find(pu => pu.user.id === response.userId).userRole = response.role;
        console.log(`Successfully changed the role to ${response.role}`);
      },
      error: error => alert(error)
    });

    this.removedUserSubscription = this.projectsService.removedUser$.subscribe({
      next: response => {
        const i = this.project.projectUsers.findIndex(pu => pu.user.id === response.userId);
        this.project.projectUsers.splice(i, 1);
        this.projectUsersSubject.next(this.project.projectUsers);
        this.deleteModal.hide();
      },
      error: err => alert(err)
    });

    this.filter.valueChanges.pipe(
      startWith(''),
      map(text => this.search(text))
    );

  }

  ngOnDestroy() {
    this.updateUserRoleSubscription.unsubscribe();
  }

  search(text: string) {
    this.projectUsersSubject.next(
      this.project.projectUsers.filter(projectUser => {
        const term = text.toLowerCase();
        return projectUser.user.fullName.toLowerCase().includes(term)
            || projectUser.user.username.includes(term);
      })
    );
  }

  numberOfManagers() {
    return this.project.projectUsers.filter(pu => pu.userRole === 'manager').length;
  }

  updateUserRole(role: string, projectUser: ProjectUser) {
    this.projectsService.updateUserRole(this.project.id, projectUser.user.id, role);
  }

  showModal(modal: ModalDirective) { modal.show(); }

  hideModal(modal: ModalDirective) { modal.hide(); }

  showDeleteModal(projectUser: ProjectUser) {
    this.userToRemove = projectUser;
    this.deleteModal.show();
  }

  deleteUser() {
    if (this.userToRemove.userRole === 'manager' && this.numberOfManagers() === 1) {
      alert('You cannot remove the last manager from the project.');
      return this.deleteModal.hide();
    }
    this.projectsService.removeUser(this.project.id, this.userToRemove.user.id);
  }

}
