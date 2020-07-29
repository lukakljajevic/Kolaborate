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

interface SearchResult {
  projects: ProjectListItem[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const compare = (v1: string, v2: string) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(projects: ProjectListItem[], column: SortColumn, direction: string): ProjectListItem[] {
  if (direction === '' || column === '') {
    return projects;
  } else {
    return [...projects].sort((a, b) => {
      const res = compare(`${a[column]}`, `${b[column]}`);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(project: ProjectListItem, term: string) {
  return project.name.toLowerCase().includes(term.toLowerCase())
    || project.createdByFullName.toLowerCase().includes(term.toLowerCase());
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private projects: ProjectListItem[];
  private recentProjects: ProjectListItem[];

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _projects$ = new BehaviorSubject<ProjectListItem[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private _recentProjects$ = new Subject<ProjectListItem[]>();

  private projectUpdated = new Subject();

  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private http: HttpClient,
              private datepipe: DatePipe,
              private authService: AuthService,
              private router: Router) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      switchMap(() => this._search()),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._projects$.next(result.projects);
      this._total$.next(result.total);
    });
  }

  get projects$() { return this._projects$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get recentProjects$() { return this._recentProjects$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }
  
  get updatedProject$() { return this.projectUpdated.asObservable(); }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: SortColumn) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;

    // 1. sort
    let projects = sort(this.projects, sortColumn, sortDirection);

    // 2. filter
    projects = projects.filter(country => matches(country, searchTerm));
    const total = projects.length;

    // 3. paginate
    projects = projects.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({projects, total});
  }

  createProject(data: any) {
    if (data.startDate) {
      data.startDate = this.datepipe.transform(data.startDate, 'yyyy-MM-dd');
    }

    if (data.endDate) {
      data.endDate = this.datepipe.transform(data.endDate, 'yyyy-MM-dd');
    }

    this.http.post('http://localhost:5002/api/projects', data).subscribe((response: {id: string}) => {
      console.log(response);
      this.router.navigate(['/projects', response.id]);
    });
  }

  getProjects() {
    this.http.get<ProjectListItem[]>('http://localhost:5002/api/projects').subscribe(projects => {
      this.projects = projects;
      this._search$.next();
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
    return this.http.post('http://localhost:5002/api/projects/invite', params);
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
        }) => this.projectUpdated.next(updatedProjectFields),
        error: () => this.projectUpdated.error('Error updating the project.')
      });
  }

  deleteProject(id: string) {
    return this.http.delete<{message: string}>(`http://localhost:5002/api/projects/${id}`);
  }

}



