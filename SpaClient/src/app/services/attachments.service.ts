import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AttachmentsService {

  constructor(private http: HttpClient) { }

  uploadAttachment(issueId: string, attachment: File) {
    const formData: FormData = new FormData();

    formData.append('attachment', attachment);
    formData.append('issueId', issueId);

    return this.http.post(`http://localhost:5002/api/attachments`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  delete(id: string) {
    return this.http.delete(`http://localhost:5002/api/attachments/${id}`);
  }

}
