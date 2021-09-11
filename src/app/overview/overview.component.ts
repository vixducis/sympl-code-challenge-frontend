import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../shared/models/project';
import { User } from '../shared/models/user';
import { NgForm } from '@angular/forms';
import { HttpService } from '../shared/http.service';
import { trigger, transition, animate, style } from '@angular/animations';
import { of } from "rxjs";
import { delay } from "rxjs/operators";
import { FormGroup, FormControl } from '@angular/forms'
import { HttpError } from '../shared/models/http-error';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('200ms ease-in', style({ transform: 'translateY(0%)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})

export class OverviewComponent implements OnInit {

  public users: Array<User> = [];
  public projects: Array<Project> = [];
  public errorMessage: string | null = null;
  public processingForm: boolean = false;

  public assignmentForm = new FormGroup({
    mail: new FormControl(),
    project: new FormControl(),
  })

  constructor(
    private route: ActivatedRoute,
    private http: HttpService
  ) { }

  ngOnInit(): void {
    this.users = this.route.snapshot.data.usersResponse;
    this.projects = this.route.snapshot.data.projectsResponse;
    this.initiateForm();
  }

  /**
   * Returns the project object for the given project id.
   * If none is found, null will be returned.
   * @param id 
   * @returns 
   */
  public getProjectWithId(id: number): Project | null {
    for (const project of this.projects) {
      if (project.id === id) {
        return project;
      }
    }
    return null;
  }

  /**
   * Submits the new assignment form.
   * Performs a couple of validations and shows a notification if they fail.
   */
  public submit(): void {
    const projectId = parseInt(this.assignmentForm.value.project);
    this.processingForm = true;
    if (isNaN(projectId) || projectId <= 0) {
      this.showError('Please select a project.');
      this.processingForm = false;
    } else if (!this.validateMail(this.assignmentForm.value.mail)) {
      this.showError('Please provide a valid mail address.');
      this.processingForm = false;
    } else {
      this.http.searchUser(this.assignmentForm.value.mail).subscribe(user => {
        if (user === null) {
          this.showError('The mail address isn\'t known to the system.');
          this.processingForm = false;
        } else {
          this.http.createAssignment(user.id, projectId).subscribe(response => {
            if (response instanceof HttpError) {
              this.processingForm = false;
              this.showError(response.message);
            } else {
              this.loadUsers(() => {
                this.processingForm = false;
              });
            }
          });
        }
      })
    }
  }

  /**
   * Removes a project assignment from a user.
   * @param userId 
   * @param projectId 
   */
  public removeAssignment(userId: number, projectId: number, event: MouseEvent): void {
    (event.currentTarget as Element).parentElement?.classList.add("loading");
    this.http.removeAssignment(userId, projectId).subscribe(() => {
      this.loadUsers();
    });
  }

  /**
   * Checks whether the provided mail address is valid.
   * @param email 
   * @returns 
   */
  private validateMail(email: string): boolean {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  /**
   * Renders a provided error message and hides it after 5 seconds
   * @param message 
   */
  private showError(message: string): void {
    this.errorMessage = message;
    of(null).pipe(
      delay(5000)
    ).subscribe(() => {
      this.errorMessage = null;
    })
  }

  /**
   * Selects the first project as the default.
   */
  private initiateForm(): void {
    if (this.projects.length > 0) {
      this.assignmentForm.patchValue({ project: this.projects[0].id })
    }
  }

  /**
   * Loads the users from the api and fill the internal object.
   */
  private loadUsers(callback: { (): void } = () => { }): void {
    this.http.getUsers().subscribe(users => {
      this.users = users;
      callback();
    });
  }
}
