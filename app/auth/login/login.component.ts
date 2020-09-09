import {Component, OnInit, ChangeDetectionStrategy, EventEmitter} from '@angular/core';
import {Location} from '@angular/common';
import {
  ActionAuthLogin,
  AppState,
  AuthService,
  NotificationService,
  ROUTE_ANIMATIONS_ELEMENTS
} from '../../core';
import {FormBuilder, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {Store} from '@ngrx/store';


@Component({
  selector: 'auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    remember: [true]
  });

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private store: Store<AppState>,
    private authService: AuthService,
    private location: Location
  ) {
    this.loading = new EventEmitter<boolean>(true);
  }
  loading: EventEmitter<boolean>;

  submit() {
    if (this.form.valid) {
      this.loading.emit(true);
      this.authService.login(this.form.getRawValue()).subscribe(token => {
        this.store.dispatch(
          new ActionAuthLogin(token)
        );
        this.location.back();
      }, (error: Response) => {
        if (error.status === 400) {
          this.notificationService.error(
            this.translate.instant('konzo.auth.error400')
          );
        } else {
          this.notificationService.error(
            this.translate.instant('konzo.auth.error')
          );
        }
        this.loading.emit(false)
      });

    }
  }

  ngOnInit() {
  }
}
