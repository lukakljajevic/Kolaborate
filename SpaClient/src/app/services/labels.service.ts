import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Label } from '../models/label';

@Injectable({
  providedIn: 'root'
})
export class LabelsService {

  private _createdLabel = new Subject<Label>();

  constructor(private http: HttpClient) { }

  get createdLabel$() { return this._createdLabel.asObservable(); }

  create(name: string) {
    this.http.post('http://localhost:5002/api/labels', {name})
      .subscribe({
        next: (label: Label) => {
          console.log(label);
          this._createdLabel.next(label);
        },
        error: (err: {message: string}) => alert(err.message)
      });
  }

}
