import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IssuesService } from '../issues.service';
import { Label } from 'src/app/models/label';

@Injectable({
  providedIn: 'root',
})
export class LabelsResolverService implements Resolve<Label[]> {

  constructor(private issuesService: IssuesService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Label[] | Observable<Label[]> | Promise<Label[]> {
    return this.issuesService.getLabels();
  }

}