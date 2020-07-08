import { Component, OnInit, Input, TemplateRef, ViewChild } from '@angular/core';
import { Phase } from 'src/app/models/phase';
import { ModalOptions, ModalDirective } from 'ngx-bootstrap/modal';
import { PhasesService } from 'src/app/services/phases.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { Project } from 'src/app/models/project';
import { IssuesService } from 'src/app/services/issues.service';
import { Label } from 'src/app/models/label';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { IssueListItem } from 'src/app/models/issue-list-item';

@Component({
  selector: 'app-phase-list',
  templateUrl: './phase-list.component.html',
  styleUrls: ['./phase-list.component.css'],
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})
export class PhaseListComponent implements OnInit {

  @Input() project: Project;
  @Input() projectId: string;
  @Input() phases: Phase[];
  @Input() dragModeEnabled = false;
  @Input() currentUserRole: string;

  @ViewChild('phaseCreateModal', {static: false})
  phaseCreateModal: ModalDirective;
  @ViewChild('issueCreateModal', {static: false})
  issueCreateModal: ModalDirective;
  @ViewChild('deleteModal', {static: false})
  deleteModal: ModalDirective;

  labels: Label[] = [];
  minDate: Date;
  phaseCreateForm: FormGroup;
  issueCreateForm: FormGroup;

  deleteType: string;
  deleteItem: Phase | IssueListItem;

  constructor(private phasesService: PhasesService,
              private issuesService: IssuesService) { }

  ngOnInit() {
    this.minDate = new Date();

    this.phaseCreateForm = new FormGroup({
      name: new FormControl('', [Validators.required])
    });

    this.issueCreateForm = new FormGroup({
      projectId: new FormControl({
        value: this.projectId,
        disabled: true
      }, [Validators.required]),
      phaseId: new FormControl({
        value: '',
        disabled: true
      }, [Validators.required]),
      issueType: new FormControl('task', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      dueDate: new FormControl(null),
      priority: new FormControl('', [Validators.required]),
      labels: new FormControl(),
      issuedTo: new FormControl(null, [Validators.required])
    });

    this.issuesService.getLabels().subscribe(labels => {
      this.labels = labels;
    });

    // Phase create subscription
    this.phasesService.createdPhase$.subscribe({
      next: response => {
        this.resetForm(this.phaseCreateForm);
        this.hideModal(this.phaseCreateModal);
      },
      error: (err: {message: string}) => alert(err.message)
    });

    // Phase delete subscription
    this.phasesService.deletedPhase$.subscribe({
      next: response => {
        alert(response.message);
        this.hideModal(this.deleteModal);
      }
    });

    // Issue create subscription
    this.issuesService.createdIssue$.subscribe({
      next: () => {
        this.resetForm(this.issueCreateForm);
        this.hideModal(this.issueCreateModal);
      },
      error: err => alert(err.message)
    });

    // Issue delete subscription
    this.issuesService.deletedIssue$.subscribe(response => {
      alert(response.message);
      this.hideModal(this.deleteModal);
    });

  }

  resetForm(form: FormGroup) {
    form.reset({
      projectId: this.project.id,
      issueType: 'task',
      priority: ''
    });
  }

  showModal(modal: ModalDirective, options?: {
    modalOptions?: ModalOptions,
    phase?: Phase,
    deleteType?: string,
    deleteItem?: Phase | IssueListItem
  }) {
    this.issueCreateForm.patchValue({phaseId: options?.phase?.id});
    modal.config = options?.modalOptions;
    this.deleteType = options?.deleteType;
    this.deleteItem = options?.deleteItem;
    modal.show();
  }

  hideModal(modal: ModalDirective) {
    modal.hide();
  }

  confirmDelete() {
    if (this.deleteType === 'phase') {
      this.phasesService.deletePhase(this.deleteItem as Phase)
    } else {
      this.issuesService.deleteIssue(this.deleteItem as IssueListItem);
    }
  }

  onPhaseCreateSubmit() {
    this.phasesService.createPhase(this.project.id, this.phaseCreateForm.value);
  }

  onIssueCreateSubmit() {
    if (!this.issueCreateForm.valid) {
      alert('Invalid form.');
      return;
    }

    const formValue = this.issueCreateForm.getRawValue();
    if (formValue.labels) {
      formValue.labels = this.formatLabels(formValue.labels);
    }

    this.issuesService.createIssue(formValue);
  }

  formatLabels(labelIds: string[]) {
    const labels: string[] = [];
    labelIds.forEach(labelId => {
      labels.push(labelId);
    });
    return labels;
  }

  onPhaseDrop(event: CdkDragDrop<Phase>) {
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.project.phases, event.previousIndex, event.currentIndex);
      moveItemInArray(this.phases, event.previousIndex, event.currentIndex);
      this.updatePhaseIndexes();
      console.log(event);
      console.log(this.project.phases);
      this.phasesService.updatePhases(this.project.phases);
    }
  }

  updatePhaseIndexes() {
    let count = 0;
    this.project.phases.forEach(phase => {
      phase.index = count++;
    });
  }
}
