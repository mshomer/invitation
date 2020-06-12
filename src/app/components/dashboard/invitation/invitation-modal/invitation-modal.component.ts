import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { map, take, find } from 'rxjs/operators';

import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { InvitationService } from 'src/app/services/invitation.service';
import { InputOption } from 'src/app/shared/component/input.component';
import { AuthService } from 'src/app/services/auth.service';
import { Invitation } from 'src/app/models/invitation.model';

@Component({
  selector: 'app-invitation-modal',
  templateUrl: './invitation-modal.component.html',
  styleUrls: ['./invitation-modal.component.scss'],
})
export class InvitationModalComponent implements OnInit, OnDestroy {
  @Input() invitation: Invitation;

  subscription: Subscription;
  private userId: string;

  title: string;

  form: FormGroup;
  faCalendarDay = faCalendarDay;

  types$: Observable<InputOption[]>;

  constructor(
    public activeModal: NgbActiveModal,
    public service: InvitationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subscription = this.authService.user
      .pipe(map((user) => user.id))
      .subscribe((userId) => (this.userId = userId));

    this.types$ = this.service.invitationTypes.pipe(
      map((types) => {
        const options: InputOption[] = [];
        for (const type of types) {
          options.push({ value: type, text: type.name, key: type.id });
        }
        return options;
      })
    );

    this.form = new FormGroup({
      type: new FormControl(null, Validators.required),
      image: new FormControl(null, Validators.required),
      fileSource: new FormControl(null, [Validators.required]),
      date: new FormControl(null, Validators.required),
      place: new FormGroup({
        name: new FormControl(null, Validators.required),
        location: new FormControl(null, Validators.required),
        image: new FormControl(null, Validators.required),
        fileSource: new FormControl(null, [Validators.required]),
        website: new FormControl(null),
        phone: new FormControl(null),
        facebook: new FormControl(null),
      }),
      content: new FormControl(null, [
        Validators.min(0),
        Validators.max(50),
        Validators.required,
      ]),
      owners: new FormArray([], Validators.required),
    });

    if (this.invitation != null) {
      this.title = 'Edit Invitation';
      this.form.patchValue({
        type: this.invitation.type.id,
        fileSource: this.invitation.image,
        date: this.invitation.date,
        place: {
          name: this.invitation.place.name,
          location: this.invitation.place.location,
          fileSource: this.invitation.place.image,
          website: this.invitation.place.website,
          phone: this.invitation.place.phone,
          facebook: this.invitation.place.facebook,
        },
        content: this.invitation.content,
      });

      for (let owner of this.invitation.owners) {
        this.addOwner(owner);
      }
    } else {
      this.title = 'Add Invitation';
      this.addOwner();
    }
  }

  async onSubmit() {
    const { type, fileSource, date, place, content, owners } = this.form.value;
    const image = fileSource;
    place.image = place.fileSource;

    const typeValue = await this.types$
      .pipe(
        take(1),
        map((types) => {
          return types.find((t) => t.key === type).value;
        })
      )
      .toPromise();

    if (this.invitation.id) {
      this.service
        .editInvitation(
          this.invitation.id,
          this.userId,
          typeValue,
          image,
          content,
          date,
          place,
          owners
        )
        .subscribe(() => {
          this.activeModal.close();
        });
    } else {
      this.service
        .addInvitation(
          this.userId,
          typeValue,
          image,
          content,
          date,
          place,
          owners
        )
        .subscribe(() => {
          this.activeModal.close();
        });
    }
  }

  addOwner(value: string = null) {
    this.owners.push(new FormControl(value));
  }

  removeOwner(index: number) {
    this.owners.removeAt(index);
  }

  get owners() {
    return this.form.controls.owners as FormArray;
  }

  onFileChange(event, controlName: string) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      var reader = new FileReader();
      reader.onload = (e) => {
        this.form.get(controlName).setValue(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
