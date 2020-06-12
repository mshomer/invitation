import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvitationsComponent } from './invitations/invitations.component';
import { DashboardComponent } from './dashboard.component';
import { UsersApproveComponent } from './invitation/users-approve/users-approve.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', component: InvitationsComponent },
      { path: ':id', component: UsersApproveComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
