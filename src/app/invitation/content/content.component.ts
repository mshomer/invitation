import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Invitation, Place } from '../../models/invitation.model';
import { PlaceModalComponent } from '../place-modal/place-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { faWaze } from '@fortawesome/free-brands-svg-icons';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent implements OnInit, OnChanges {
  @Input() invitation: Invitation;
  faWaze = faWaze;
  owners: string;
  safeWazeLink: SafeStyle;

  constructor(
    private modalService: NgbModal,
    private sanitization: DomSanitizer
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    const entity = changes.invitation.currentValue as Invitation;

    this.owners = this.ownersToString(entity.owners);

    this.safeWazeLink = this.sanitization.bypassSecurityTrustUrl(
      `waze://?q=<${entity.place.name} ${entity.place.location}>`
    );
  }

  openPlaceModal(place: Place) {
    const modalRef = this.modalService.open(PlaceModalComponent);
    modalRef.componentInstance.place = place;
    modalRef.componentInstance.safeWazeLink = this.safeWazeLink;
  }

  ownersToString(owners: string[]) {
    if (!owners || owners.length == 0) {
      return '';
    }
    if (owners.length > 1) {
      return owners.slice(0, -1).join(',') + ' ו' + owners.slice(-1);
    }

    return owners[0];
  }
}
