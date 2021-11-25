import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { AccountService } from 'src/app/Services/account-service/account-service';
import { PopupService } from 'src/app/Services/popup-service/popup.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup;
  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private popupService: PopupService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      repeatNewPassword: ['', Validators.required],
    });
  }

  CloseModal() {
    this.modalController.dismiss();
  }

  async updatePassword() {
    if (
      this.form.valid &&
      this.form.get('newPassword').value ===
        this.form.get('repeatNewPassword').value
    ) {
      const updatePasswordModel = {
        userId: await this.accountService.GetUserId(),
        oldPassword: this.form.get('oldPassword').value,
        newPassword: this.form.get('newPassword').value,
      };

      this.accountService.UpdatePassword(updatePasswordModel).subscribe(
        (rez) => {
          this.popupService.SimplePopup('Success', 1000, 'success');
          this.CloseModal();
        },
        (error) => {
          this.popupService.SimplePopup('error', 2000, 'danger');
          console.log(error.error);
        }
      );
    }
  }
}
