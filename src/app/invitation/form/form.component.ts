import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InvitationService } from 'src/app/services/invitation.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  @Input() id: string;
  form: FormGroup;
  formSubmited = false;

  constructor(private service: InvitationService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      userName: new FormControl(null, Validators.required),
      userPhone: new FormControl(null, Validators.required),
      approveStatus: new FormControl(null, Validators.required),
      totalPeople: new FormControl(0, [
        Validators.min(0),
        Validators.max(50),
        Validators.required,
      ]),
      note: new FormControl(null),
    });
  }

  onSubmit() {
    this.formSubmited = true;
    const {
      userName,
      userPhone,
      approveStatus,
      totalPeople,
      note,
    } = this.form.value;

    this.service
      .approveInvitation(
        this.id,
        userName,
        userPhone,
        approveStatus,
        totalPeople,
        note
      )
      .subscribe(() => {});
  }

  get approveStatus() {
    return this.form.get('approveStatus').value;
  }

  get totalPeople() {
    return this.form.get('totalPeople').value;
  }

  set totalPeople(count: number) {
    this.form.get('totalPeople').setValue(count);
  }
}
