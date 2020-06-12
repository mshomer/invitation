import { Injectable } from '@angular/core';
import { combineLatest } from 'rxjs';
import { InvitationService } from './invitation.service';
import { AuthService } from './auth.service';

@Injectable()
export class AppLoadService {
  constructor(
    private invitationService: InvitationService,
    private authService: AuthService
  ) {}

  initializeApp(): Promise<any> {
    return new Promise((resolve, reject) => {
      combineLatest(
        this.authService.autoLogin(),
        this.invitationService.fetchInvitations(),
        this.invitationService.fetchUserApproveInvitations(),
        this.invitationService.fetchInvitationTypes()
      ).subscribe(() => {
        resolve();
      });
    });
  }
}
