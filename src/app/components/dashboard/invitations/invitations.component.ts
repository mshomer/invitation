import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';

import { Observable } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { InvitationService } from 'src/app/services/invitation.service';
import { Invitation, InvitationType } from 'src/app/models/invitation.model';
import { InvitationModalComponent } from '../invitation/invitation-modal/invitation-modal.component';

@Component({
  selector: 'app-invitations',
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.scss'],
})
export class InvitationsComponent implements OnInit {
  @ViewChild('countdownNumber') countdownNumber: ElementRef;
  @ViewChild('svg') svg: ElementRef;

  private interval: any = 0;
  private countdownCount = 0;
  timeOut = 5000;

  invitations$: Observable<Invitation[]>;

  private modalRef: NgbModalRef;

  invitationURLCopied = false;

  constructor(
    private service: InvitationService,
    private modalService: NgbModal,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.invitations$ = this.service.invitations;
  }

  openInvitation(invitation: Invitation = null) {
    this.modalRef = this.modalService.open(InvitationModalComponent);
    this.modalRef.componentInstance.invitation = invitation;
  }

  shareLink(id: string) {
    const linkMessage = window.location.href.replace(
      this.location.path(),
      `/invitation/${id}`
    );
    this.copyMessage(linkMessage);
    this.showToastMessage();
  }

  showToastMessage() {
    this.clearCountdown();

    setTimeout(() => {
      this.invitationURLCopied = true;
      this.countdownCount = this.timeOut / 1000;
      const intervalCSS = `animation: countdown ${this.countdownCount}s linear forwards;`;
      this.svg.nativeElement
        .querySelector('circle')
        .setAttribute('style', intervalCSS);
      this.countdownNumber.nativeElement.textContent = this.countdownCount.toString();
      this.interval = setTimeout(() => this.onCountdown(), 1000);
    }, 0);
  }

  onCountdown() {
    if (--this.countdownCount > 0) {
      this.countdownNumber.nativeElement.textContent = this.countdownCount.toString();
      this.interval = setTimeout(() => this.onCountdown(), 1000);
    } else {
      this.clearCountdown();
    }
  }

  clearCountdown() {
    this.invitationURLCopied = false;
    this.countdownCount = 0;
    clearInterval(this.interval);
  }

  copyMessage(message: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = message;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}
