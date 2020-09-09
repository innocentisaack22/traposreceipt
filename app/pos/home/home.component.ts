import { Store, select } from '@ngrx/store';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


import { State as BaseSettingsState } from '../../settings';

import { State as BaseExamplesState } from '../pos.state';
import {routeAnimations, selectAuth} from "../../core";

interface State extends BaseSettingsState, BaseExamplesState {}

@Component({
  selector: 'konzo-pos-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [routeAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;

  examples = [
    { link: 'dashboard', label: 'konzo.pos.menu.dashboard', auth: true }
  ];

  constructor(private store: Store<State>) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this.store.pipe(
      select(selectAuth),
      map(auth => auth.isAuthenticated)
    );
  }
}
