import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Account, LoginInfo } from 'src/app/Models/AccountModels';
import { AccountService } from 'src/app/Services/account-service/account-service';

enum ACCOUNTSCREENMODE {
  Register = 1,
  Login = 2,
}

@Component({
  selector: 'app-register-login',
  templateUrl: './registerlogin.component.html',
  styleUrls: ['./registerlogin.component.scss'],
})
export class RegisterLoginComponent implements OnInit {
  ACCOUNTSCREENMODE = ACCOUNTSCREENMODE;
  mode: ACCOUNTSCREENMODE = ACCOUNTSCREENMODE.Register;
  registerForm: FormGroup;
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private menuController: MenuController,
    private router: Router
  ) {}

  ionViewDidEnter() {
    this.menuController.enable(false); //to fix "assert _before() should be called while animating" error
  }

  ngOnInit() {
    this.BuildForm();
    this.accountService.isLoggedIn().then((rez) => {
      if (rez) {
        this.router.navigate(['Diary']);
      }
    });
  }

  ionViewWillLeave() {
    this.menuController.enable(true);
  }

  BuildForm() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.compose([Validators.email, Validators.required])],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
    });

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.email, Validators.required])],
      password: ['', Validators.required],
    });
  }

  GetReversedMode(mode: ACCOUNTSCREENMODE) {
    if (mode === this.ACCOUNTSCREENMODE.Register) {
      return ACCOUNTSCREENMODE.Login;
    } else {
      return ACCOUNTSCREENMODE.Register;
    }
  }

  switchMode() {
    this.mode = this.GetReversedMode(this.mode);
    this.BuildForm();
  }

  Register() {
    if (
      this.registerForm.valid &&
      this.registerForm.controls.password.value ===
        this.registerForm.controls.repeatPassword.value
    ) {
      const account: Account = {
        firstName: this.registerForm.controls.firstName.value,
        lastName: this.registerForm.controls.lastName.value,
        password: this.registerForm.controls.password.value,
        email: this.registerForm.controls.email.value,
      };

      this.accountService.Register(account);
      this.switchMode();
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  Login() {
    if (this.loginForm.valid) {
      const loginInfo: LoginInfo = {
        email: this.loginForm.controls.email.value,
        password: this.loginForm.controls.password.value,
      };
      this.accountService.Login(loginInfo);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
