import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignLayoutComponent } from './sign-layout.component';

const routes: Routes = [
  {
    path: '',
    component: SignLayoutComponent,
  },
];

@NgModule({
  declarations: [SignInComponent, SignUpComponent, SignLayoutComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  exports: [],
})
export class SignLayoutModule {}
