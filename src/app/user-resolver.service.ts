import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from './shared/http.service';
import { User } from './shared/models/user';

@Injectable()
export class UserResolver implements Resolve<any> {

  constructor(
    private http: HttpService
  ) { }

  resolve(): Observable<Array<User>> {
    return this.http.getUsers();
  }
}
