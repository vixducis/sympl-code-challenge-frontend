import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { ProjectResolver } from './project-resolver.service';
import { UserResolver } from './user-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: OverviewComponent,
    resolve: {
      usersResponse: UserResolver,
      projectsResponse: ProjectResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    UserResolver,
    ProjectResolver
  ]
})
export class AppRoutingModule { }
