import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Place } from '../../models/invitation.model';

import { faWaze, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faPhoneAlt, faHome } from '@fortawesome/free-solid-svg-icons';
import { SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-place-modal',
  templateUrl: './place-modal.component.html',
  styleUrls: ['./place-modal.component.scss'],
})
export class PlaceModalComponent implements OnInit {
  @Input() place: Place;
  @Input() safeWazeLink: SafeStyle;

  faWaze = faWaze;
  faFacebook = faFacebook;
  faPhoneAlt = faPhoneAlt;
  faHome = faHome;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {}
}
