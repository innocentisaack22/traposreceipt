import browser from 'browser-detect';
import {
  AfterContentInit, AfterViewInit,
  ChangeDetectorRef,
  Component, EventEmitter,
  OnInit
} from '@angular/core';
import {Store, select} from '@ngrx/store';
import {Observable} from 'rxjs';

import {
  ActionAuthLogout,
  routeAnimations,
  AppState,
  LocalStorageService,
  selectIsAuthenticated,
  selectHideBars,
  DataService,
  Owner,
  selectFullName,
  IdUserRelation,
  selectIdUserRelation,
  selectAdminUserOwners,
  selectCurrentOwner, selectAllUserOwners, ActionMasafaSetCurrentOwner
} from './core';
import {environment as env} from '../environments/environment';
import {
  ActionSettingsChangeAnimationsPageDisabled, ActionSettingsChangeLanguage, selectEffectiveTheme,
  selectSettingsLanguage,
  selectSettingsStickyHeader
} from './settings';
import {JwtHelperService} from '@auth0/angular-jwt';
import {debounceTime, map, retry, startWith, switchMap, take} from 'rxjs/operators';
import Timeout = NodeJS.Timeout;
import {FormControl} from '@angular/forms';


@Component({
  selector: 'konzo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimations]
})
export class AppComponent implements OnInit, AfterContentInit, AfterViewInit {

  constructor(
    private store: Store<AppState>,
    private storageService: LocalStorageService,
    private cdRef: ChangeDetectorRef,
    private dataService: DataService,
  ) {
    this.getAllOwners({name: 'cache'})
  }

  isProd = env.production;
  envName = env.envName;
  version = env.versions.app;
  year = new Date().getFullYear();
  logo = require('../../images/logo.png');
  languages = ['en', 'sw'];
  navigation = [];
  navigationSideMenu = [];

  userOwners$: Observable<String[]>;
  idUserRelation$: Observable<IdUserRelation[]>;
  fullName$: Observable<any>;
  isAuthenticated$: Observable<boolean>;
  stickyHeader$: Observable<boolean>;
  language$: Observable<string>;
  theme$: Observable<string>;
  hideBars: boolean;
  filteredOwners$: Observable<Owner[]>;
  private ownerSelect: FormControl;

  private jwtHelper = new JwtHelperService();

  owners: Owner[];
  getAllOwnersTimer: Timeout;

  private static isIEorEdgeOrSafari() {
    return ['ie', 'edge', 'safari'].includes(browser().name);
  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.storageService.testLocalStorage();
    if (AppComponent.isIEorEdgeOrSafari()) {
      this.store.dispatch(
        new ActionSettingsChangeAnimationsPageDisabled({
          pageAnimationsDisabled: true
        })
      );
    }

    this.userOwners$ = this.store.pipe(select(selectAllUserOwners));
    this.idUserRelation$ = this.store.pipe(select(selectIdUserRelation));
    this.fullName$ = this.store.pipe(select(selectFullName));
    this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));

    this.stickyHeader$ = this.store.pipe(select(selectSettingsStickyHeader));
    this.language$ = this.store.pipe(select(selectSettingsLanguage));
    this.theme$ = this.store.pipe(select(selectEffectiveTheme));
    this.store.pipe(select(selectHideBars)).subscribe((v) => {
      setTimeout(() => {
        this.hideBars = v;
        this.cdRef.detectChanges();
      });
    });


    this.ownerSelect = new FormControl();
    this.filteredOwners$ = this.ownerSelect.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
      switchMap(value => this.getAllOwners(value))
    );


    this.isAuthenticated$.subscribe(isAuth => {
      this.navigation = [{link: 'home', label: 'konzo.menu.home'}];
      if (isAuth) {
        this.navigation = [
          ...this.navigation,
          {link: 'pos', label: 'konzo.menu.pos'}
        ];
      }
      this.navigationSideMenu = [
        ...this.navigation,
        {link: 'settings', label: 'konzo.menu.settings'}
      ];
    });

    setTimeout(() => this.setUpOwner());
  }


  private setUpOwner() {
    this.store.pipe(select(selectCurrentOwner), take(1)).subscribe(owner => {
      this.userOwners$.subscribe((owners => {
        const userOwners: Owner[] = this.owners ? this.owners.filter(o => owners.indexOf(o.ownerId) > -1) : [];
        if (owner && owners.indexOf(owner.ownerId) > -1) {
          this.ownerSelect.setValue(owner);
        } else if (userOwners.length > 0) {
          this.store.dispatch(new ActionMasafaSetCurrentOwner(userOwners[0]));
          this.setUpOwner();
        }
      }));
    });
  }

  ngAfterContentInit() {
  }

  onLogoutClick() {
    this.store.dispatch(new ActionAuthLogout());
  }

  onLanguageSelect({value: language}) {
    this.store.dispatch(new ActionSettingsChangeLanguage({language}));
  }

  displayOptionFn(option?: { value: number, name: string }): string | undefined {
    return option ? option.name : undefined;
  }

  setCurrentOwner(owner: Owner) {
    this.store.dispatch(new ActionMasafaSetCurrentOwner(owner));
  }

  private getAllOwners(value: {
    name: string;
  }): Observable<Owner[]> {
    const observable = new EventEmitter<Owner[]>();
    if ((typeof value === 'object' && !value.name)) {
      return observable;
    }
    // tslint:disable-next-line:no-shadowed-variable
    const filterFn = (value: { ownerId: string; name: string } | any): Owner[] => this.owners.filter(option => option.name.toLowerCase().includes((value.name || <any>value).toLowerCase()));
    if (this.getAllOwnersTimer) {
      clearTimeout(this.getAllOwnersTimer);
      this.getAllOwnersTimer = null;
    }
    this.getAllOwnersTimer = setTimeout(() => {
      if (this.owners) {
        observable.emit(filterFn(value));
      } else {
        this.isAuthenticated$.subscribe(auth => {
          if (auth) {
            this.dataService.getOwners().subscribe((data) => {
              this.owners = <any>data;
              observable.emit(filterFn(value));
              this.setUpOwner();
            });
          }
        });

      }
    }, 100);

    return observable;

  }
}
