import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { YourWorkComponent } from './your-work/your-work.component';
import { HomeComponent } from './home/home.component';
import { ProjectCreateComponent } from './projects/project-create/project-create.component';
import { ProjectDetailComponent } from './projects/project-detail/project-detail.component';
import { ProjectListComponent } from './projects/project-list/project-list.component';
import { ProjectDetailResolverService } from './services/resolvers/project-detail-resolver.service';
import { IssueDetailComponent } from './projects/issues/issue-detail/issue-detail.component';
import { IssueDetailResolverService } from './services/resolvers/issue-detail-resolver.service';
import { AccountComponent } from './account/account.component';
import { ProjectManageComponent } from './projects/project-manage/project-manage.component';

const routes: Routes = [
  {
    path: 'your-work',
    component: YourWorkComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'project-create',
    component: ProjectCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'projects',
    component: ProjectListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'projects/:id',
    component: ProjectDetailComponent,
    resolve: {
      project: ProjectDetailResolverService
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'projects/:id/manage',
    component: ProjectManageComponent,
    resolve: {
      project: ProjectDetailResolverService
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'projects/:projectId/issues/:issueId',
    component: IssueDetailComponent,
    resolve: {
      results: IssueDetailResolverService
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: HomeComponent
  },
  // {
  //   path: '**',
  //   component: HomeComponent
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [ProjectDetailResolverService]
})
export class AppRoutingModule { }
