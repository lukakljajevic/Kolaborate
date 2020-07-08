import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { ProjectsService } from 'src/app/services/projects.service';
import { ProjectListItem } from 'src/app/models/project-list-item';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgbdSortableHeader, SortEvent, State } from 'src/app/services/sortable.directive';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  projects$: Observable<ProjectListItem[]>;
  total$: Observable<number>;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  

  constructor(public projectsService: ProjectsService, library: FaIconLibrary) {
    this.projects$ = projectsService.projects$;
    this.total$ = projectsService.total$;
    
    // library.addIcons(fasStar, farStar);
  }

  ngOnInit() {
    this.projectsService.getProjects();
  }

  onSort({column, direction}: SortEvent) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    console.log('onsortevent');

    this.projectsService.sortColumn = column;
    this.projectsService.sortDirection = direction;
  }

}
