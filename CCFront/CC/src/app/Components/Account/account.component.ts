import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Account, LoginInfo } from 'src/app/Models/AccountModels';
import { AccountService } from 'src/app/Services/account-service/account-service';
import { PopupService } from 'src/app/Services/popup-service/popup.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private popupService: PopupService
  ) {}

  ngOnInit() {
    this.BuildForm();
  }

  BuildForm() {
    this.form = this.formBuilder.group({
      userId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.compose([Validators.email, Validators.required])],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
      passwordHash: ['', Validators.required],
      role: ['', Validators.required],
    });

    this.accountService.GetUser().then((rez) => {
      this.form.controls.userId.setValue(rez.userId);
      this.form.controls.firstName.setValue(rez.firstName);
      this.form.controls.lastName.setValue(rez.lastName);
      this.form.controls.email.setValue(rez.email);
      this.form.controls.passwordHash.setValue(rez.passwordHash);
      this.form.controls.role.setValue(rez.role);
    });
  }

  UpdateUser() {
    if (
      this.form.valid &&
      this.form.controls.password.value ===
        this.form.controls.repeatPassword.value
    ) {
      const account: Account = {
        userId: this.form.controls.userId.value,
        firstName: this.form.controls.firstName.value,
        lastName: this.form.controls.lastName.value,
        password: this.form.controls.password.value,
        email: this.form.controls.email.value,
        passwordHash: this.form.controls.passwordHash.value,
        role: this.form.controls.role.value,
      };

      this.accountService.UpdateUser(account).subscribe(
        (rez) => {
          this.popupService.SimplePopup('Success', 1000, 'success');
        },
        (error) => {
          this.popupService.SimplePopup('error', 2000, 'danger');
        }
      );
    } else {
      if (this.form.controls.password.value == '') {
        this.popupService.SimplePopup(
          'Password cannot be empty',
          3000,
          'danger'
        );
      } else {
        this.popupService.SimplePopup('Passwords do not match', 3000, 'danger');
      }

      this.form.markAllAsTouched();
    }
  }
}
