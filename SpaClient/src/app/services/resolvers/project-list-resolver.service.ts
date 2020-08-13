import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ProjectListItem } from 'src/app/models/project-list-item';
import { Observable } from 'rxjs';
import { ProjectsService } from '../projects.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectListResolverService implements Resolve<ProjectListItem[]> {

  constructor(private projectsService: ProjectsService) { }

  resolve(route: ActivatedRouteSnapshot): ProjectListItem[] | Observable<ProjectListItem[]> {
    return this.projectsService.getProjectsAsObservable();
  }

}
