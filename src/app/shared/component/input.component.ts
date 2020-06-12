import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroupDirective, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

export type InputType = 'text' | 'file' | 'textera' | 'checkbox' | 'radio';

export interface InputOption {
  text: string;
  key: string;
  value: any;
}

@Component({
  selector: 'app-input',
  template: `
    <ng-container [formGroup]="formGroupDirective.control">
      <div class="form-group col-12" [class.input-group]="inputGroup">
        <label *ngIf="label" class="form-label-control" [for]="label">{{
          label
        }}</label>

        <div [ngSwitch]="type">
          <div *ngSwitchCase="'radio'">
            <div
              class="custom-control custom-radio"
              *ngFor="let option of options; let i = index"
            >
              <input
                type="radio"
                class="custom-control-input"
                id="{{ controlName }}_{{ i }}"
                [name]="controlName"
                [formControlName]="controlName"
                [value]="option.key"
              />
              <label
                class="custom-control-label"
                for="{{ controlName }}_{{ i }}"
                >{{ option.text }}</label
              >
            </div>
          </div>
          <div *ngSwitchCase="'select'">
            <select class="custom-select" [formControlName]="controlName">
              <option [value]="option.key" *ngFor="let option of options">{{
                option.text
              }}</option>
            </select>
          </div>
          <div *ngSwitchCase="'texteara'">
            <textarea
              class="form-control"
              [formControlName]="controlName"
              [rows]="rows"
              [cols]="cols"
            >
            </textarea>
          </div>
          <div *ngSwitchCase="'file'">
            <div class="custom-file">
              <input
                type="file"
                class="custom-file-input"
                id="{{ controlName }}_file"
                [formControlName]="controlName"
              />
              <label
                class="custom-file-label"
                for="{{ controlName }}_file"
              ></label>
            </div>
          </div>
          <div *ngSwitchDefault>
            <input
              [type]="type"
              class="form-control"
              [formControlName]="controlName"
            />
          </div>
        </div>
        <div *ngIf="inputGroup" class="input-group-prepend">
          <span
            class="input-group-text"
            (click)="onInputGroupClick()"
            [class.cursor-pointer]="inputGroupClick.observers.length > 0"
            >{{ inputGroup }}</span
          >
        </div>
        <div
          class="invalid-feedback"
          [class.d-block]="!control.valid && control.touched"
        >
          {{ error }}
        </div>
      </div>
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
      },
    `,
    `
      textarea {
        resize: none;
      }
    `,
    `
      .form-group div:first-child {
        flex: 1;
      }
    `,
  ],
})
export class InputComponent implements OnInit {
  @Input() type: InputType;
  @Input() controlName: string;
  @Input() label: string;
  @Input() rows: number;
  @Input() cols: number;
  @Input() options: InputOption[];
  @Input() inputGroup: string;

  @Output() inputGroupClick: EventEmitter<void> = new EventEmitter();

  subscription: Subscription;
  control: AbstractControl;

  private defaultErrors = {
    required: (error) => `This field is required`,
    minlength: ({ requiredLength, actualLength }) =>
      `Expect min length ${requiredLength} but got ${actualLength}`,
    maxlength: ({ requiredLength, actualLength }) =>
      `Expect max length ${requiredLength} but got ${actualLength}`,
    min: ({ requiredNumber, actualNumber }) =>
      `Expect min number ${requiredNumber} but got ${actualNumber}`,
    max: ({ requiredNumber, actualNumber }) =>
      `Expect max number ${requiredNumber} but got ${actualNumber}`,
  };

  error: string;

  constructor(public formGroupDirective: FormGroupDirective) {}

  ngOnInit(): void {
    this.control = this.formGroupDirective.form.get(this.controlName);
    this.subscription = this.control.statusChanges
      .pipe(filter((status) => status === 'INVALID'))
      .subscribe((status) => {
        const controlErrors = this.control.errors;
        if (controlErrors) {
          const firstKey = Object.keys(controlErrors)[0];
          const getError = this.defaultErrors[firstKey];
          this.error = getError(controlErrors[firstKey]);
        }
      });
  }

  onInputGroupClick() {
    this.inputGroupClick.emit();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
