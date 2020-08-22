import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomValidators } from '../form-validators/customValidators';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-details-form',
  templateUrl: './details-form.component.html',
  styleUrls: ['./details-form.component.css']
})
export class DetailsFormComponent implements OnInit {

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  detailsForm: FormGroup;
  @ViewChild('emailList', { static: true }) emailList;
  grades: string[] = [
    '8th Grade',
    '9th Grade',
    '10th Grade',
    '11th Grade',
    '12th Grade',
  ];
  emails: string[] = ['bvarley@gmail.com'];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  // tslint:disable-next-line: variable-name
  constructor(public fb: FormBuilder, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.reactiveForm();
  }

  /* Reactive detailsForm */
  reactiveForm() {
    this.detailsForm = this.fb.group({
      name: ['', [Validators.required]],
      emails: [
        this.emails,
        [CustomValidators.validateRequired, CustomValidators.validateEmails],
      ],
      gender: ['Male'],
      dob: ['', [Validators.required]],
      grade: ['', [CustomValidators.validateRequired]],
    });

    this.detailsForm.controls.emails.setValue(this.emails);
  }

  /* Date */
  date(e) {
    const convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.detailsForm.get('dob').setValue(convertDate, {
      onlyself: true,
    });
  }

  addEmail(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if (value.trim() !== '') {
      this.detailsForm.controls.emails.setErrors(null); // 1
      const tempEmails = this.detailsForm.controls.emails.value; // 2
      tempEmails.push(value.trim());
      this.detailsForm.controls.emails.setValue(tempEmails); // 3
      if (this.detailsForm.controls.emails.valid) {
        // 4
        this.detailsForm.controls.emails.markAsDirty();
        input.value = ''; // 5
      } else {
        // const index = this.emails.findIndex(value1 => value1 === value.trim());
        // if (index !== -1) {
        //   this.emails.splice(index, 1);           // 6
        // }
        this.detailsForm.controls.emails.markAsDirty();
        input.value = '';
        this.detailsForm.controls.emails.updateValueAndValidity();
      }
    } else {
      this.detailsForm.controls.emails.updateValueAndValidity(); // 7
    }
  }

  removeEmail(email: string): void {
    const controller = this.detailsForm.controls.emails;
    const index = this.emails.indexOf(email, 0);
    if (index > -1) {
      this.emails.splice(index, 1);
    }
    controller.updateValueAndValidity();
    controller.markAsDirty();
  }

  public errorHandling = (control: string, error: string) => {
    return this.detailsForm.controls[control].hasError(error);
  }

  submitForm() {
    this.detailsForm.controls.emails.markAsTouched();
    if (this.detailsForm.valid) {
      this._snackBar.open(
        'Form Valid, you are a Reactive Forms Wizard!',
        'Sent',
        {
          duration: 2000,
        }
      );
    }
  }
}

