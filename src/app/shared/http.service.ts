import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpResponse } from './models/http-response';
import { User, UserJson } from './models/user';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Project, ProjectJson } from './models/project';
import { Assignment, AssignmentJson } from './models/assignment';
import { HttpError } from './models/http-error';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  //private readonly baseUrl = 'https://www.wouterh.be/sympl/api/'
  private readonly baseUrl = 'http://127.0.0.1:8000/'

  constructor(private http: HttpClient) { }

  /**
   * Fetches all users from the api.
   * @returns 
   */
  public getUsers(): Observable<Array<User>> {
    return this.http.get<HttpResponse<Array<UserJson>>>(
      this.baseUrl + 'users',
      {
        responseType: 'json',
        observe: 'body'
      }
    ).pipe(
      map(response => {
        const users = [];
        for (let json of response.data) {
          users.push(User.fromJson(json));
        }
        return users;
      })
    );
  }

  /**
   * Fetches all projects from the api.
   * @returns 
   */
  public getProjects(): Observable<Array<Project>> {
    return this.http.get<HttpResponse<Array<ProjectJson>>>(
      this.baseUrl + 'projects',
      {
        responseType: 'json',
        observe: 'body'
      }
    ).pipe(
      map(response => {
        const projects = [];
        for (let json of response.data) {
          projects.push(Project.fromJson(json));
        }
        return projects;
      })
    );
  }

  /**
   * Searches the api for a user with the given email address.
   * Returns it if found, null if nothing is found.
   * @param mail 
   * @returns 
   */
  public searchUser(mail: string): Observable<User|null> {
    return this.http.get<HttpResponse<Array<UserJson>>>(
      this.baseUrl + 'users?mail=' + encodeURIComponent(mail),
      {
        responseType: 'json',
        observe: 'body'
      }
    ).pipe(
      map(response => {
        return response.data.length > 0
          ? User.fromJson(response.data[0])
          : null;
      })
    );
  }

  /**
   * Attaches a project to the given user with the api.
   * @param userid 
   * @param projectid 
   * @returns 
   */
  public createAssignment(userId: number, projectId: number): Observable<Assignment|HttpError> {
    return this.http.post<HttpResponse<AssignmentJson>>(
      this.baseUrl + 'users/' + userId + '/project/' + projectId,
      {
        responseType: 'json',
        observe: 'body'
      }
    ).pipe(
      map(response => {
        return Assignment.fromJson(response.data);
      }),
      catchError((err: HttpErrorResponse) => {
        return of(new HttpError(
          'error' in err.error
            ? err.error.error
            : 'Something went wrong'
        ));
      })
    );
  }

  /**
   * Removes the assignment of the given project from the given user.
   * @param userId 
   * @param projectId 
   * @returns 
   */
  public removeAssignment(userId: number, projectId: number): Observable<any> {
    return this.http.delete(
      this.baseUrl + 'users/' + userId + '/project/' + projectId
    );
  }
}
