import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProtectedComponent } from './protected/protected.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { CallApiComponent } from './call-api/call-api.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { YourWorkComponent } from './your-work/your-work.component';
import { HomeComponent } from './home/home.component';
import { ProjectCreateComponent } from './projects/project-create/project-create.component';
import { ProjectDetailComponent } from './projects/project-detail/project-detail.component';
import { ProjectListComponent } from './projects/project-list/project-list.component';
import { ProjectDetailResolverService } from './services/resolvers/project-detail-resolver.service';
import { LabelsResolverService } from './services/resolvers/labels-resolver.service';


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
      project: ProjectDetailResolverService,
      labels: LabelsResolverService
    }
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  {
    path: '',
    component: HomeComponent
  },
  {
    path: '**',
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [ProjectDetailResolverService]
})
export class AppRoutingModule { }
