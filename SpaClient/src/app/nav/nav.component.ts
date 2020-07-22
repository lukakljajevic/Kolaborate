import { Component, OnInit, OnDestroy } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ProjectListItem } from '../models/project-list-item';
import { ProjectsService } from '../services/projects.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {

  fullName: string;
  isAuthenticated: boolean;
  authSubscription: Subscription;
  userDataSubscription: Subscription;
  recentProjects: ProjectListItem[];
  recentProjectsSubscription: Subscription;

  constructor(private oidcSecurityService: OidcSecurityService,
              private projectsService: ProjectsService,
              public authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.authSubscription = this.oidcSecurityService.checkAuth().subscribe(auth => {
      this.isAuthenticated = auth;
      if (this.isAuthenticated) {
        this.fullName = this.authService.fullName;
        this.router.navigate(['/your-work']);
        this.recentProjectsSubscription = this.projectsService.recentProjects$.subscribe(projects => {
          this.recentProjects = projects;
        });
        this.projectsService.getRecentProjects();
      }
    });

    this.userDataSubscription = this.authService.userData$
      .subscribe(data => {
        this.fullName = data.fullName;
      });
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

  login() {
    this.oidcSecurityService.authorize();
  }

  logout() {
    this.oidcSecurityService.logoff();
  }

}
