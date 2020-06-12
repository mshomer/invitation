import { Component, OnInit } from '@angular/core';
import { Invitation } from './../models/invitation.model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { InvitationService } from '../services/invitation.service';

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.scss'],
})
export class InvitationComponent implements OnInit {
  id: string;
  invitation$: Observable<Invitation>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: InvitationService
  ) {}

  ngOnInit() {
    this.invitation$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.id = params.get('id');
        if (!this.id) {
          this.router.navigateByUrl('/');
          return;
        }
        const invitation = this.service.getInvitation(this.id);

        invitation.pipe(take(1)).subscribe((invitation) => {
          if (!invitation.id) {
            this.router.navigateByUrl('page-not-found');
          }
        });

        return invitation;
      })
    );
  }
}
