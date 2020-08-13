import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { ProjectsService } from 'src/app/services/projects.service';
import { ProjectListItem } from 'src/app/models/project-list-item';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgbdSortableHeader, SortEvent, State } from 'src/app/services/sortable.directive';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  projects: ProjectListItem[];

  projectsSubject = new Subject<ProjectListItem[]>();
  totalSubject = new Subject<number>();

  projects$ = this.projectsSubject.asObservable();
  total$ = this.totalSubject.asObservable();
  filter = new FormControl('');
  page = 1;
  pageSize = 4;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.projects = data.projects;
      console.log(this.projects);
      setTimeout(() => {
        this.onPageChange();
        this.totalSubject.next(this.projects.length);
      }, 0);
    });
  }

  search(text: string) {
    this.projectsSubject.next(
      this.projects.filter(project => project.name.toLowerCase().includes(text.toLowerCase())
      || project.createdBy.fullName.toLowerCase().includes(text.toLowerCase()))
    );
  }

  onPageChange() {
    this.projectsSubject.next(this.projects
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize));
  }

}
