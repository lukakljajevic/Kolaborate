import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Phase } from '../models/phase';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PhasesService {

  private createdPhase: Subject<{message: string, phase: Phase}> = new Subject();
  private updatedPhase: Subject<{projectId: string, phaseId: string, name: string}> = new Subject<any>();
  private updatedPhases: Subject<Phase[]> = new Subject();
  private deletedPhase: Subject<{message: string, phases: Phase[], projectId: string}> = new Subject();

  constructor(private http: HttpClient) {}

  get createdPhase$() { return this.createdPhase.asObservable(); }
  get updatedPhase$() { return this.updatedPhase.asObservable(); }
  get updatedPhases$() { return this.updatedPhases.asObservable(); }
  get deletedPhase$() { return this.deletedPhase.asObservable(); }

  createPhase(projectId: string, formData: {name: string}) {
    this.http.post<{message: string, phase: Phase}>(`http://localhost:5002/api/projects/${projectId}/phases`, formData)
      .subscribe({
        next: response => this.createdPhase.next(response),
        error: (err: {message: string}) => this.createdPhase.error(err)
      });
  }

  updatePhases(phases: Phase[]) {
    this.http.post<{message: string}>('http://localhost:5002/api/phases', {phases})
      .subscribe(response => {
        console.log(response.message);
        this.updatedPhases.next(phases);
      }, error => console.error(error.message));
  }

  updatePhase(projectId: string, phaseId: string, name: string) {
    this.http.put(`http://localhost:5002/api/projects/${projectId}/phases/${phaseId}`, {name}).subscribe({
      next: () => this.updatedPhase.next({projectId, phaseId, name}),
      error: (err: {message: string}) => alert(err.message)
    });
  }

  deletePhase(phase: Phase) {
    this.http.delete<{message: string, phases: Phase[]}>(`http://localhost:5002/api/projects/${phase.project.id}/phases/${phase.id}`)
      .subscribe({
        next: response => this.deletedPhase.next({...response, projectId: phase.project.id}),
        error: (err: {message: string}) => this.deletedPhase.error(err)
      });
  }
}