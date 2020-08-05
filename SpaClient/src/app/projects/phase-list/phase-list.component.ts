import { Component, OnInit, Input, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
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
import { Subscription } from 'rxjs';

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

  labels: Label[] = [];
  minDate: Date;

  phaseCreateForm: FormGroup;
  phaseEditForm: FormGroup;
  issueCreateForm: FormGroup;
  addLabelsForm: FormGroup;
  availableLabels: Label[] = [];
  deleteType: string;
  deleteItem: Phase | IssueListItem;

  createdPhaseSubscription: Subscription;
  deletedPhaseSubscription: Subscription;
  createdIssueSubscription: Subscription;
  updatedIssueSubscription: Subscription;
  deletedIssueSubscription: Subscription;

  constructor(private phasesService: PhasesService,
              private issuesService: IssuesService) { }

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

    this.issuesService.getLabels().subscribe(labels => {
      this.labels = labels;
    });

    // Phase create subscription
    this.createdPhaseSubscription = this.phasesService.createdPhase$.subscribe({
      next: response => {
        this.resetForm(this.phaseCreateForm);
        this.hideModal(this.phaseCreateModal);
      },
      error: (err: {message: string}) => alert(err.message)
    });

    // Phase delete subscription
    this.deletedPhaseSubscription = this.phasesService.deletedPhase$.subscribe({
      next: response => {
        alert(response.message);
        this.hideModal(this.deleteModal);
      }
    });

    // Issue create subscription
    this.createdIssueSubscription = this.issuesService.createdIssue$.subscribe({
      next: () => {
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
      alert(response.message);
      this.hideModal(this.deleteModal);
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
    // if (formValue.labels) {
    //   formValue.labels = this.formatLabels(formValue.labels);
    // }

    // formValue.issuedTo = this.formatIssuedTo(formValue.issuedTo);

    console.log(formValue.description);
    formValue.description = formValue.description.replace(/\n\r?/g, '<br />');
    // console.log(formValue.description);

    this.issuesService.createIssue(formValue);
  }

  formatLabels(labelIds: string[]) {
    const labels: string[] = [];
    labelIds.forEach(labelId => {
      labels.push(labelId);
    });
    return labels;
  }

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
    this.generateAvailableLabels(issue);
    this.addLabelsForm.patchValue(
      {
        issueId: issue.id,
        issueName: issue.name
      }
    );
    this.showModal(this.addLabelsModal);
  }

  onAddLabelSubmit() {
    const formData = this.addLabelsForm.getRawValue();
    this.issuesService.addLabels({issueId: formData.issueId, labels: formData.labels});
  }

  generateAvailableLabels(issue: IssueListItem) {
    this.availableLabels = [];
    this.labels.forEach(label => {
      if (issue.labels.findIndex(l => l.id === label.id) === -1) {
        this.availableLabels.push(label);
      }
    });
  }
}
