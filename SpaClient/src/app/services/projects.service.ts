import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable, Subscription, BehaviorSubject, Subject, of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { ProjectListItem } from '../models/project-list-item';
import { SortColumn, SortDirection } from './sortable.directive';
import { tap, debounceTime, switchMap, delay } from 'rxjs/operators';
import { Project } from '../models/project';
import { ProjectUser } from '../models/project-user';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private projects: ProjectListItem[];
  private recentProjects: ProjectListItem[];

  private _projects = new Subject<ProjectListItem[]>();
  private _recentProjects$ = new Subject<ProjectListItem[]>();
  private createdProject = new Subject<any>();
  private projectUpdated = new Subject<any>();
  private deletedProject = new Subject<any>();
  private updatedUserRole = new Subject<{userId: string, role: string}>();
  private removedUser = new Subject<{userId: string}>();


  constructor(private http: HttpClient,
              private datepipe: DatePipe,
              private authService: AuthService,
              private router: Router) {}

  get projects$() { return this._projects.asObservable(); }
  get recentProjects$() { return this._recentProjects$.asObservable(); }
  get createdProject$() { return this.createdProject.asObservable(); }
  get updatedProject$() { return this.projectUpdated.asObservable(); }
  get deletedProject$() { return this.deletedProject.asObservable(); }
  get updatedUserRole$() { return this.updatedUserRole.asObservable(); }
  get removedUser$() { return this.removedUser.asObservable(); }

  createProject(data: any) {
    if (data.startDate) {
      data.startDate = this.datepipe.transform(data.startDate, 'yyyy-MM-dd');
    }

    if (data.endDate) {
      data.endDate = this.datepipe.transform(data.endDate, 'yyyy-MM-dd');
    }

    this.http.post('http://localhost:5002/api/projects', data).subscribe((response: {id: string}) => {
      this.router.navigate(['/projects', response.id]);
      console.log(response);
      this.createdProject.next();
    });
  }

  getProjectsAsObservable() {
    return this.http.get<ProjectListItem[]>('http://localhost:5002/api/projects');
  }

  getProjects() {
    this.http.get<ProjectListItem[]>('http://localhost:5002/api/projects')
      .subscribe({
        next: projects => this._projects.next(projects),
        error: err => this._projects.error('Failed to get projects')
      });
  }

  getRecentProjects() {
    this.http.get<ProjectListItem[]>('http://localhost:5002/api/projects/recent').subscribe(recentProjects => {
      this.recentProjects = recentProjects;
      this._recentProjects$.next(recentProjects);
    });
  }

  getRecentProjectsLocal() {
    this._recentProjects$.next(this.recentProjects);
  }

  getProject(id: string) {
    return this.http.get<Project>(`http://localhost:5002/api/projects/${id}`);
  }

  addUser(params: {projectId: string, userId: string, userFullName: string, userRole: string}) {
    return this.http.post('http://localhost:5002/api/projects/users', params);
  }

  updateProject(id: string, data: any) {
    if (data.startDate) {
      data.startDate = this.datepipe.transform(data.startDate, 'yyyy-MM-dd');
    }

    if (data.endDate) {
      data.endDate = this.datepipe.transform(data.endDate, 'yyyy-MM-dd');
    }

    this.http.put(`http://localhost:5002/api/projects/${id}`, data)
      .subscribe({
        next: (updatedProjectFields: {
          name: string,
          description: string,
          startDate: string,
          endDate: string
        }) => {
          this.getRecentProjects();
          this.projectUpdated.next({...updatedProjectFields, id});
        },
        error: () => this.projectUpdated.error('Error updating the project.')
      });
  }

  deleteProject(id: string) {
    this.http.delete<{message: string}>(`http://localhost:5002/api/projects/${id}`)
      .subscribe({
        next: () => this.deletedProject.next(id),
        error: error => this.deletedProject.error(error)
      });
  }

  updateUserRole(projectId: string, userId: string, role: string) {
    this.http.put(`http://localhost:5002/api/projects/${projectId}/users/${userId}`, {role})
      .subscribe({
        next: () => this.updatedUserRole.next({userId, role}),
        error: (err: {message: string}) => this.updatedUserRole.error(err.message)
      });
  }

  removeUser(projectId: string, userId: string) {
    this.http.delete(`http://localhost:5002/api/projects/${projectId}/users/${userId}`)
      .subscribe({
        next: () => this.removedUser.next({userId}),
        error: (err: {message: string}) => this.removedUser.error(err.message)
      });
  }

}



