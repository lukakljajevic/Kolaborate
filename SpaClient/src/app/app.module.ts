import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_INITIALIZER, NgModule, Pipe } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, CommonModule } from '@angular/common';
import { AuthModule, LogLevel, OidcConfigService } from 'angular-auth-oidc-client';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { AuthService } from './services/auth.service';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { NavComponent } from './nav/nav.component';
import { YourWorkComponent } from './your-work/your-work.component';
import { HomeComponent } from './home/home.component';
import { ProjectCreateComponent } from './projects/project-create/project-create.component';
import { ProjectsService } from './services/projects.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ProjectDetailComponent } from './projects/project-detail/project-detail.component';
import { ProjectListComponent } from './projects/project-list/project-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { TokenInterceptor } from './services/token.interceptor';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { PhaseListComponent } from './projects/phase-list/phase-list.component';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NgbdSortableHeader } from './services/sortable.directive';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { IssueDetailComponent } from './projects/issues/issue-detail/issue-detail.component';
import { AccountComponent } from './account/account.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { TimeAgoPipe } from 'time-ago-pipe';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ProjectManageComponent } from './projects/project-manage/project-manage.component';
import { ChartsModule } from 'ng2-charts';

export function configureAuth(oidcConfigService: OidcConfigService) {
   return () =>
       oidcConfigService.withConfig({
           stsServer: 'https://localhost:44305',
           redirectUrl: 'http://localhost:4200',
           postLogoutRedirectUri: 'http://localhost:4200',
           clientId: 'angular_spa',
           scope: 'openid profile api.full_access',
           responseType: 'code',
         //   silentRenew: true,
         //   silentRenewUrl: `${window.location.origin}/silent-renew.html`,
           logLevel: LogLevel.Debug,
       });
}

@Pipe({
   name: 'timeAgo',
   pure: false
})
export class TimeAgoExtendsPipe extends TimeAgoPipe {}

@NgModule({
   declarations: [
      AppComponent,
      UnauthorizedComponent,
      NavComponent,
      YourWorkComponent,
      HomeComponent,
      ProjectCreateComponent,
      ProjectDetailComponent,
      ProjectListComponent,
      PhaseListComponent,
      TimeAgoExtendsPipe,
      NgbdSortableHeader,
      IssueDetailComponent,
      AccountComponent,
      ProjectManageComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      FormsModule,
      CommonModule,
      ReactiveFormsModule,
      AuthModule.forRoot(),
      BrowserAnimationsModule,
      BsDropdownModule.forRoot(),
      BsDatepickerModule.forRoot(),
      NgbModule,
      FontAwesomeModule,
      DragDropModule,
      TypeaheadModule.forRoot(),
      TabsModule.forRoot(),
      ModalModule.forRoot(),
      TooltipModule.forRoot(),
      ImageCropperModule,
      ProgressbarModule.forRoot(),
      ChartsModule
   ],
   providers: [
      AuthGuard,
      AuthService,
      ProjectsService,
      BsModalService,
      OidcConfigService,
      {
         provide: APP_INITIALIZER,
         useFactory: configureAuth,
         deps: [OidcConfigService],
         multi: true,
      },
      DatePipe,
      {
         provide: HTTP_INTERCEPTORS,
         useClass: TokenInterceptor,
         multi: true
      }
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule {
   constructor(library: FaIconLibrary) {
      library.addIconPacks(fas, far);
   }
}
