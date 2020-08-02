import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Project } from '../../models/project';
import { Observable, EMPTY } from 'rxjs';
import { ProjectsService } from '../projects.service';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectDetailResolverService implements Resolve<Project> {

  constructor(private projectsService: ProjectsService,
              private authService: AuthService,
              private router: Router) { }

  resolve(route: ActivatedRouteSnapshot): Project | Observable<Project> | Promise<Project> {
    const id = route.paramMap.get('id');
    const userId = this.authService.userId;
    console.log(userId);
    return this.projectsService.getProject(id).pipe(
      map(project => {
        console.log(project);
        const projectUser = project.projectUsers.find(pu => pu.user.id === userId);
        if (!projectUser) {
          this.router.navigate(['/unauthorized']);
          return null;
        }
        return project;
      })
    );
  }

}