import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { InvitationsComponent } from './invitations/invitations.component';
import { UsersApproveComponent } from './invitation/users-approve/users-approve.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { InvitationModalComponent } from './invitation/invitation-modal/invitation-modal.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DashboardComponent } from './dashboard.component';
import { InputComponent } from 'src/app/shared/component/input.component';
import { SortService } from 'src/app/services/sort.service';
import { SortableHeader } from 'src/app/shared/directive/sortable.directive';

@NgModule({
  declarations: [
    NavbarComponent,
    DashboardComponent,
    InvitationsComponent,
    InvitationModalComponent,
    UsersApproveComponent,
    InputComponent,
    SortableHeader,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
  ],
  providers: [SortService, DecimalPipe],
})
export class DashboardModule {}
