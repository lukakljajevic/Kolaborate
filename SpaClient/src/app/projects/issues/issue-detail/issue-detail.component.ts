import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Issue } from 'src/app/models/issue';
import { ModalDirective, ModalOptions } from 'ngx-bootstrap/modal';
import { Observable, Observer, of, from, Subscribable, Subscription } from 'rxjs';
import { UserListItem } from 'src/app/models/user-list-item';
import { switchMap, map } from 'rxjs/operators';
import { UsersService } from 'src/app/services/users.service';
import { Project } from 'src/app/models/project';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { IssuesService } from 'src/app/services/issues.service';
import { AuthService } from 'src/app/services/auth.service';
import { IssueUser } from 'src/app/models/issue-user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Label } from 'src/app/models/label';
import { User } from 'src/app/models/user';
import { Comment } from 'src/app/models/comment';
import { CommentsService } from 'src/app/services/comments.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Attachment } from 'src/app/models/attachment';
import { AttachmentsService } from 'src/app/services/attachments.service';

@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.css']
})
export class IssueDetailComponent implements OnInit, OnDestroy {

  issue: Issue;
  issueStatus = {
    to_do: 'To do',
    in_progress: 'In progress',
    done: 'Done'
  };

  issuePriority = {
    1: 'Lowest',
    2: 'Low',
    3: 'Medium',
    4: 'High',
    5: 'Highest'
  };

  issueIcon = {
    1: 'arrow-down',
    2: 'arrow-down',
    3: 'arrow-up',
    4: 'arrow-up',
    5: 'arrow-up'
  };

  isStarred: boolean;
  issuedToCurrentUser: boolean;

  project: Project;
  userFullName = '';
  users$: Observable<UserListItem[]>;
  selectedUser: User;

  labels: Label[];
  selectedLabelIds: string[] = [];
  issueEditForm: FormGroup;

  updatedIssueSubscription: Subscription;

  @ViewChild('editIssueModal', {static: false})
  editIssueModal: ModalDirective;
  @ViewChild('deleteModal', {static: false})
  deleteModal: ModalDirective;
  @ViewChild('attachmentsModal', {static: false})
  attachmentsModal: ModalDirective;

  typingComment = false;
  newCommentText = '';
  editCommentText = '';

  deleteType = '';
  deleteId = '';

  deletedIssueSubscription: Subscription;

  @ViewChild('fileInput', {static: false})
  fileInput: ElementRef;
  selectedFiles: FileList;
  progressInfos = [];
  successMessage = '';
  errorMessage = '';
  fileInfos: Observable<any>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public authService: AuthService,
              private issuesService: IssuesService,
              private commentsService: CommentsService,
              private attachmentsService: AttachmentsService) { }

  ngOnInit() {
    this.route.data.subscribe((data: {results: {issue: Issue, project: Project}}) => {
      console.log(data.results);
      this.issue = data.results.issue;
      this.project = data.results.project;

      const index = this.issue.issuedTo.findIndex(iu => iu.user.id === this.authService.userId);
      this.issuedToCurrentUser = index > -1;

      if (this.issuedToCurrentUser) {
        this.isStarred = this.issue.issuedTo[index].isStarred;
      }

      this.issueEditForm = new FormGroup({
        issueType: new FormControl(this.issue.issueType, Validators.required),
        name: new FormControl(this.issue.name, Validators.required),
        description: new FormControl(this.issue.description.replace(/<br\s*[\/]?>/gi, '\n'), Validators.required),
        dueDate: new FormControl(this.formatDate(this.issue.dueDate)),
        labels: new FormControl(this.selectedLabelIds),
      });

      this.issue.labels.forEach(l => this.selectedLabelIds.push(l.id));
    });

    this.users$ = new Observable((observer: Observer<string>) => {
      observer.next(this.userFullName);
    }).pipe(
      switchMap((fullName: string) => {
        if (fullName) {
          return of(this.project.projectUsers).pipe(
            map(users => users.filter(pu => !this.issue.issuedTo.find(iu => iu.user.id === pu.user.id))
          ));
        }
        return of([]);
      })
    );

    this.issuesService.getLabels().subscribe(labels => {
      this.labels = labels;
    });

    this.updatedIssueSubscription = this.issuesService.updatedIssue$
      .subscribe((data: {
        name: string,
        description: string,
        dueDate: string,
        issueType: string,
        labels: string[]
      }) => {
        this.issue.issueType = data.issueType;
        this.issue.dueDate = data.dueDate;
        this.issue.name = data.name;
        this.issue.description = data.description;
        this.issue.labels = [];
        data.labels.forEach(id => this.issue.labels.push(this.labels.find(l => l.id === id)));
        this.editIssueModal.hide();
      });

    this.deletedIssueSubscription = this.issuesService.deletedIssue$
      .subscribe({
        next: response => {
          alert(response.message);
          this.router.navigate(['/projects', this.issue.phase.project.id]);
        },
        error: err => alert(err.message)
      });

  }

  ngOnDestroy() {
    this.deletedIssueSubscription.unsubscribe();
    this.updatedIssueSubscription.unsubscribe();
  }

  hasLabel(id: string): boolean {
    return this.issue.labels.findIndex(l => l.id === id) > -1;
  }

  labelChecked(event: any) {
    if (event.target.checked) {
      this.selectedLabelIds.push(event.target.id);
    } else {
      const index = this.selectedLabelIds.findIndex(id => id === event.target.id);
      this.selectedLabelIds.splice(index, 1);
    }
  }

  onIssueUpdateSubmit() {
    this.issueEditForm.value.labels = this.selectedLabelIds;
    this.issueEditForm.value.description = this.issueEditForm.value.description.replace(/\n\r?/g, '<br />');
    this.issuesService.updateIssue(this.issue.id, this.issueEditForm.value);
  }

  formatIssueStatus(status: string) {
    return this.issueStatus[status];
  }

  generateAvailableIssueStatuses() {
    const issueStatuses = ['to_do', 'in_progress', 'done'];
    const index = issueStatuses.findIndex(s => s === this.issue.status);
    issueStatuses.splice(index, 1);
    return issueStatuses;
  }

  updateStatus(status: string) {
    this.issue.status = status;
    this.issuesService.updateStatus(this.issue.id, this.issue.status);
  }

  getInitials(fullName: string) {
    const nameArray = fullName.split(' ');
    return nameArray[0].charAt(0) + nameArray[nameArray.length - 1].charAt(0);
  }

  generateAvailableIssuePriorities() {
    const issuePriorities = [1, 2, 3, 4, 5];
    const index = issuePriorities.findIndex(p => p === this.issue.priority);
    issuePriorities.splice(index, 1);
    return issuePriorities;
  }

  updatePriority(priority: number) {
    this.issue.priority = priority;
    this.issuesService.updatePriority(this.issue.id, this.issue.priority);
  }

  showModal(modal: ModalDirective) {
    modal.show();
  }

  hideModal(modal: ModalDirective) {
    modal.hide();
  }

  typeaheadOnSelect(e: TypeaheadMatch) {
    console.log(e.item);
    this.selectedUser = e.item.user;
  }

  showAddAssigneeModal(assigneesModal: ModalDirective, addAssigneeModal: ModalDirective) {
    this.showModal(addAssigneeModal);
    this.hideModal(assigneesModal);
  }

  addAssignee(modal: ModalDirective) {
    this.issuesService.addAssignee(this.issue.id, this.selectedUser, this.project.id)
      .subscribe({
        next: () => {
          this.issue.issuedTo.push({
            user: this.selectedUser,
            isStarred: false,
            issue: null
          });
          this.hideModal(modal);
          this.selectedUser = null;
          this.userFullName = '';
        },
        error: (err: {message: string}) => alert(err.message)
      });
  }

  updateStarred() {
    this.isStarred = !this.isStarred;
    this.issuesService.updateIsStarred(this.issue.id, this.isStarred);
  }

  deleteAssignee(assignee: IssueUser, modal: ModalDirective) {
    if (this.issue.issuedTo.length === 1) {
      alert('You are not allowed to remove last issued to user.');
      return modal.hide();
    }
    console.log(assignee);
    this.issuesService.deleteAssignee(this.issue.id, assignee.user.id)
      .subscribe({
        next: () => {
          const index = this.issue.issuedTo.findIndex(iu => iu.user.id === assignee.user.id);
          this.issue.issuedTo.splice(index, 1);
          modal.hide();
        }
      });
  }

  formatDate(date: string) {
    if (!date) return null;
    const dateArray = date.split('-');
    const day = +dateArray[2];
    const month = +dateArray[1] - 1;
    const year = +dateArray[0];
    return new Date(year, month, day);
  }

  printDate(date: string) {
    const dateArray = date.split('-');
    const day = +dateArray[2];
    const month = +dateArray[1];
    const year = +dateArray[0];
    return `${day < 10 ? '0' : ''}${day}.${month < 10 ? '0' : ''}${month}.${year}.`;
  }

  initializeCreateComment() {
    this.typingComment = true;
    this.issue.comments.forEach(comment => comment.editMode = false);
  }

  createComment() {
    this.newCommentText = this.newCommentText.replace(/\n\r?/g, '<br />');
    this.commentsService.createComment({text: this.newCommentText, issueId: this.issue.id})
      .subscribe((comment) => {
        console.log(comment);
        this.issue.comments.unshift(comment);
        this.newCommentText = '';
        this.typingComment = false;
      });
  }

  editComment(comment: Comment) {
    this.issue.comments.forEach(c => c.editMode = false);
    comment.editMode = true;
    this.typingComment = false;
    this.editCommentText = comment.text.replace(/<br\s*[\/]?>/gi, '\n');
  }

  updateComment(comment: Comment) {
    this.editCommentText = this.editCommentText.replace(/\n\r?/g, '<br />');
    this.commentsService.updateComment(comment.id, this.editCommentText)
      .subscribe({
        next: () => {
          const editedComment = this.issue.comments.find(c => c.id === comment.id);
          editedComment.text = this.editCommentText;
          editedComment.editMode = false;
        },
        error: () => alert('Error updating the comment.')
      });
  }

  delete(deleteType: string, deleteId: string) {
    this.deleteType = deleteType;
    this.deleteId = deleteId;
    this.showModal(this.deleteModal);
  }

  confirmDelete() {
    if (this.deleteType === 'comment') {
      this.commentsService.deleteComment(this.deleteId)
        .subscribe({
          next: () => {
            const i = this.issue.comments.findIndex(c => c.id === this.deleteId);
            this.issue.comments.splice(i, 1);
            this.deleteModal.hide();
          },
          error: () => alert('Error deleting the comment.')
        });
    } else if (this.deleteType === 'issue') {
      this.issuesService.deleteIssue(this.deleteId);
    } else if (this.deleteType === 'attachment') {
      this.attachmentsService.delete(this.deleteId)
        .subscribe({
          next: () => {
            const i = this.issue.attachments.findIndex(a => a.id === this.deleteId);
            this.issue.attachments.splice(i, 1);
            this.deleteModal.hide();
          },
          error: () => alert('Error deleting the attachment.')
        });
    }
  }

  selectFiles(event) {
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
  }

  uploadFiles() {
    this.successMessage = '';
    this.errorMessage = '';

    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.upload(i, this.selectedFiles[i]);
    }
  }

  upload(idx, file) {
    this.progressInfos[idx] = { value: 0, fileName: file.name };

    this.attachmentsService.uploadAttachment(this.issue.id, file).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.successMessage = 'Upload successful.';
          console.log(event);
          this.issue.attachments.push(event.body as Attachment);
          console.log(this.issue);
        }
      },
      err => {
        this.progressInfos[idx].value = 0;
        this.errorMessage = 'Could not upload the file: ' + file.name;
      });
  }

  hideAttachmentsModal() {
    this.selectedFiles = null;
    this.fileInput.nativeElement.value = null;
    this.successMessage = '';
    this.errorMessage = '';
    this.progressInfos = [];
    this.attachmentsModal.hide();
  }

  getSizeInKb(size: number) {
    return Math.round(size / 1024);
  }

  printAttachmentName(name: string) {
    if (name.length < 21) {
      return name;
    }
    return name.substr(0, 25) + '...';
  }

}
