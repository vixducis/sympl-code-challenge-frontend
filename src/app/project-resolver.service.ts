import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from './shared/http.service';
import { Project } from './shared/models/project';

@Injectable()
export class ProjectResolver implements Resolve<any> {

  constructor(
    private http: HttpService
  ) { }

  resolve(): Observable<Array<Project>> {
    return this.http.getProjects();
  }
}
