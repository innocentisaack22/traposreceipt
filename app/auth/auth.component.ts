import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  ActionLayoutHideBars,
  AppState,
  AuthService,
  routeAnimations
} from '../core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'konzo-auth',
  templateUrl: './auth.component.html',
  animations: [routeAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent implements OnInit, OnDestroy, AfterContentInit {
  private hidedBar: boolean;
  constructor(
    private store: Store<AppState>,
    private authService: AuthService
  ) {}
  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.authService.barHidden && !this.hidedBar) {
      setTimeout(() => {
        this.store.dispatch(new ActionLayoutHideBars({ hideBars: false }));
      });
    }
  }

  ngAfterContentInit(): void {
    if (!this.authService.barHidden) {
      this.hidedBar = true;
      setTimeout(() => {
        this.store.dispatch(new ActionLayoutHideBars({ hideBars: true }));
      });
    }
  }
}
