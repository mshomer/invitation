import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PlaceModalComponent } from './place-modal/place-modal.component';
import { InvitationComponent } from './invitation.component';
import { ContentComponent } from './content/content.component';
import { FormComponent } from './form/form.component';
import { InvitationRoutingModule } from './invitation-routing.module';

@NgModule({
  declarations: [
    PlaceModalComponent,
    PlaceModalComponent,
    InvitationComponent,
    ContentComponent,
    FormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    InvitationRoutingModule,
  ],
  exports: [InvitationComponent],
})
export class InvitationModule {}
