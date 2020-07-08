import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { ProjectsService } from '../projects.service';
import { Issue } from 'src/app/models/issue';
import { IssuesService } from '../issues.service';

@Injectable({
  providedIn: 'root',
})
export class IssueDetailResolverService implements Resolve<Issue> {

  constructor(private issuesService: IssuesService,
              private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Issue | Observable<Issue> | Promise<Issue> {
    const id = route.paramMap.get('issueId');
    return this.issuesService.getIssue(id);
  }

}