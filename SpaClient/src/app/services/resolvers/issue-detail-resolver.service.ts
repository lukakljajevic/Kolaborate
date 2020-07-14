import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, EMPTY, forkJoin } from 'rxjs';
import { ProjectsService } from '../projects.service';
import { Issue } from 'src/app/models/issue';
import { IssuesService } from '../issues.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class IssueDetailResolverService implements Resolve<any> {

  constructor(private issuesService: IssuesService,
              private projectsService: ProjectsService,
              private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const issueId = route.paramMap.get('issueId');
    const projectId = route.paramMap.get('projectId');

    return forkJoin([
      this.issuesService.getIssue(issueId),
      this.projectsService.getProject(projectId)
    ]).pipe(
      map(result => {
        console.log(result);
        return {
          issue: result[0],
          project: result[1]
        };
      })
    );
  }

}