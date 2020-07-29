import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.css']
})
export class ProjectCreateComponent implements OnInit {

  projectCreateForm: FormGroup;

  constructor(private projectsService: ProjectsService) { }

  ngOnInit() {
    this.projectCreateForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      startDate: new FormControl(),
      endDate: new FormControl()
    }, {validators: validateDates});
  }

  onSubmit() {
    if (this.projectCreateForm.valid) {
      this.projectsService.createProject(this.projectCreateForm.value);
    }
  }
}

export function validateDates(form: FormGroup): ValidationErrors | null {
  const startDate = form.get('startDate').value;
  const endDate = form.get('endDate').value;
  if ((startDate && endDate && !((startDate as Date) < (endDate as Date))) || (!startDate && endDate)) {
    return {datesInvalid: true};
  }
  return null;
}