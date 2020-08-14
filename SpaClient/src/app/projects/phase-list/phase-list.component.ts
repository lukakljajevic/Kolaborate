import { Component, OnInit, Input, TemplateRef, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
import { UserListItem } from 'src/app/models/user-list-item';
import { Subscription, of, Observable, throwError } from 'rxjs';
import { LabelsService } from 'src/app/services/labels.service';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-phase-list',
  templateUrl: './phase-list.component.html',
  styleUrls: ['./phase-list.component.css'],
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})
export class PhaseListComponent implements OnInit, OnDestroy {

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
  @ViewChild('addLabelsModal', {static: false})
  addLabelsModal: ModalDirective;
  @ViewChild('createLabelModal', {static: false})
  createLabelModal: ModalDirective;

  // labels: Label[] = [];
  minDate: Date;

  phaseCreateForm: FormGroup;
  phaseEditForm: FormGroup;
  issueCreateForm: FormGroup;
  addLabelsForm: FormGroup;
  availableLabels: Label[] = [];
  deleteType: string;
  deleteItem: Phase | IssueListItem;

  labelCreateForm: FormGroup;
  selectedLabelIds: string[] = [];
  editLabelsIssue: IssueListItem;

  createdPhaseSubscription: Subscription;
  deletedPhaseSubscription: Subscription;
  createdIssueSubscription: Subscription;
  updatedIssueSubscription: Subscription;
  deletedIssueSubscription: Subscription;
  createdLabelSubscription: Subscription;

  // labelsChecked: [{id: string, name: string, checked: boolean}];
  labelsChecked = [];

  constructor(private phasesService: PhasesService,
              private issuesService: IssuesService,
              private labelsService: LabelsService) { }

  ngOnInit() {
    this.minDate = new Date();

    this.phaseCreateForm = new FormGroup({
      name: new FormControl('', [Validators.required])
    });

    this.phaseEditForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
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

    this.addLabelsForm = new FormGroup({
      issueId: new FormControl('', [Validators.required]),
      issueName: new FormControl('', [Validators.required]),
      labels: new FormControl('', [Validators.required])
    });

    this.labelCreateForm = new FormGroup({
      name: new FormControl('', Validators.required)
    });

    this.issuesService.getLabels().subscribe(labels => {
      // this.labels = labels;
      labels.forEach(l => this.labelsChecked.push({
        id: l.id,
        name: l.name,
        checked: false
      }));
    });

    // Phase create subscription
    this.createdPhaseSubscription = this.phasesService.createdPhase$
      .subscribe({
        next: () => {
          this.resetForm(this.phaseCreateForm);
          this.hideModal(this.phaseCreateModal);
        },
        error: err => {
          alert(err.error.message);
        }
      });

    // Phase delete subscription
    this.deletedPhaseSubscription = this.phasesService.deletedPhase$.subscribe({
      next: response => {
        this.hideModal(this.deleteModal);
      }
    });

    // Issue create subscription
    this.createdIssueSubscription = this.issuesService.createdIssue$.subscribe({
      next: () => {
        this.resetLabelsCheckedObject();
        this.resetForm(this.issueCreateForm);
        this.hideModal(this.issueCreateModal);
      },
      error: err => alert(err.message)
    });

    // Issue update subscription
    this.updatedIssueSubscription = this.issuesService.updatedIssue$.subscribe({
      next: response => {
        this.hideModal(this.addLabelsModal);
      }
    });

    // Issue delete subscription
    this.deletedIssueSubscription = this.issuesService.deletedIssue$.subscribe(response => {
      this.hideModal(this.deleteModal);
    });

    // Label create subscription
    this.createdLabelSubscription = this.labelsService.createdLabel$
      .subscribe((label: Label) => {
        // this.labels.push(label);
        this.labelCreateForm.patchValue({ name: '' });
        this.labelsChecked.push({
          id: label.id,
          name: label.name,
          checked: false
        });
        this.createLabelModal.hide();
      });

  }

  ngOnDestroy() {
    this.createdPhaseSubscription.unsubscribe();
    this.deletedPhaseSubscription.unsubscribe();
    this.createdIssueSubscription.unsubscribe();
    this.updatedIssueSubscription.unsubscribe();
    this.deletedIssueSubscription.unsubscribe();
  }

  resetForm(form: FormGroup, value?: any) {
    form.reset(value);
  }

  showModal(modal: ModalDirective, options?: {
    modalOptions?: ModalOptions,
    phase?: Phase,
    deleteType?: string,
    deleteItem?: Phase | IssueListItem,
    phaseEdit?: boolean
  }) {
    this.issueCreateForm.patchValue({phaseId: options?.phase?.id});
    modal.config = options?.modalOptions;
    this.deleteType = options?.deleteType;
    this.deleteItem = options?.deleteItem;
    if (options?.phaseEdit) {
      this.phaseEditForm.patchValue({
        id: options.phase.id,
        name: options.phase.name
      });
    }
    modal.show();
  }

  hideModal(modal: ModalDirective) {
    modal.hide();
  }

  confirmDelete() {
    if (this.deleteType === 'phase') {
      this.phasesService.deletePhase(this.deleteItem as Phase);
    } else {
      this.issuesService.deleteIssue((this.deleteItem as IssueListItem).id);
    }
  }

  onPhaseCreateSubmit() {
    this.phasesService.createPhase(this.project.id, this.phaseCreateForm.value);
  }

  onPhaseEditSubmit(modal: ModalDirective) {
    const phaseId = this.phaseEditForm.value.id;
    const phaseName = this.phaseEditForm.value.name;
    this.phasesService.updatePhase(this.project.id, phaseId, phaseName)
      .subscribe({
        next: () => {
          this.project.phases.find(p => p.id === phaseId).name = phaseName;
          this.phases.find(p => p.id === phaseId).name = phaseName;
          modal.hide();
        },
        error: (err: {message: string}) => alert(err.message)
      });
  }

  onIssueCreateSubmit() {
    if (!this.issueCreateForm.valid) {
      alert('Invalid form.');
      return;
    }

    const formValue = this.issueCreateForm.getRawValue();
    console.log(formValue.description);
    formValue.description = formValue.description.replace(/\n\r?/g, '<br />');
    formValue.labels = this.selectedLabelIds;
    this.issuesService.createIssue(formValue);
  }

  // formatLabels(labelIds: string[]) {
  //   const labels: string[] = [];
  //   labelIds.forEach(labelId => {
  //     labels.push(labelId);
  //   });
  //   return labels;
  // }

  formatIssuedTo(issuedToIds: string[]) {
    const issuedToUsers = [];
    issuedToIds.forEach(id => {
      const projectUser = this.project.projectUsers.find(pu => pu.user.id === id);
      issuedToUsers.push(projectUser.user.id);
    });
    return issuedToUsers;
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

  showAddLabelModal(issue: IssueListItem) {
    this.resetLabelsCheckedObject();
    issue.labels.forEach(label =>
      this.labelsChecked.find(l => l.id === label.id).checked = true);

    this.editLabelsIssue = issue;
    this.selectedLabelIds = [];
    issue.labels.forEach(l => this.selectedLabelIds.push(l.id));
    this.addLabelsForm.patchValue({
      issueId: issue.id,
      issueName: issue.name
    });
    this.addLabelsModal.show();
    console.log(issue.labels);
    console.log(this.labelsChecked);
  }

  onAddLabelSubmit() {
    const formData = this.addLabelsForm.getRawValue();
    formData.labels = this.selectedLabelIds;
    console.log(formData);
    this.issuesService.addLabels({issueId: formData.issueId, labels: formData.labels});
  }

  showCreateLabelModal() {
    this.addLabelsModal.hide();
    this.createLabelModal.show();
  }

  resetLabelsCheckedObject() {
    this.selectedLabelIds = [];
    this.labelsChecked.forEach(l => l.checked = false);
  }

  onCreateLabelSubmit() {
    if (!this.labelCreateForm.valid) {
      return;
    }

    this.labelsService.create(this.labelCreateForm.value.name);
  }

  labelChecked(event: any) {
    console.log(this.labelsChecked);
    if (event.target.checked) {
      this.selectedLabelIds.push(event.target.value);
    } else {
      const index = this.selectedLabelIds.findIndex(id => id === event.target.value);
      this.selectedLabelIds.splice(index, 1);
    }
  }

  hasLabel(id: string): boolean {
    if (!this.editLabelsIssue) {
      return false;
    }
    return this.editLabelsIssue.labels.findIndex(l => l.id === id) > -1;
  }

  onAddLabelsModalHidden() {
    this.resetForm(this.addLabelsForm);
    this.resetLabelsCheckedObject();
  }

  onIssueCreateModalHidden() {
    this.resetForm(this.issueCreateForm, {
      projectId: this.project.id,
      issueType: 'task',
      priority: ''
    });
    this.resetLabelsCheckedObject();
  }
}
