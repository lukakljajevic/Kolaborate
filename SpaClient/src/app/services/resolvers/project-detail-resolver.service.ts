import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Project } from '../../models/project';
import { Observable, EMPTY } from 'rxjs';
import { ProjectsService } from '../projects.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectDetailResolverService implements Resolve<Project> {

  constructor(private projectsService: ProjectsService, 
              private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Project | Observable<Project> | Promise<Project> {
    const id = route.paramMap.get('id');
    return this.projectsService.getProject(id);
  }

}