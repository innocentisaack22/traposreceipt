import {Component, OnInit, ChangeDetectionStrategy, EventEmitter, OnDestroy} from '@angular/core';
import {AppState, DataService, Owner, ROUTE_ANIMATIONS_ELEMENTS, selectCurrentOwner} from '../../core';
import {PosStation} from '../../core/masafa/models/PosStation';
import {select, Store} from '@ngrx/store';
import {concatMap, expand, map, take} from 'rxjs/operators';
import { Subscription, timer} from 'rxjs';
import * as shape from 'd3-shape';


@Component({
  selector: 'konzo-pos-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit, OnDestroy {

  constructor(private dataService: DataService,
              private store: Store<AppState>) {
  }
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  view: any[];
  chartStations: any[];
  // curve=shape.curveNatural;
  curve = shape.curveLinear;

  dashBoardSubscription: Subscription;

  dataSource$ = new EventEmitter<PosStation[]>();
  displayedColumns: string[] = ['name', 'address', 'todayNetTotal', 'todayTotal'];

  ngOnInit() {
    const currentOwner = this.store.pipe(select(selectCurrentOwner), take(1));
    const d = new Date().toISOString().substring(0, 10);
    const stationsReq = (owner: Owner) => this.dataService.dashboardStations({ownerId: owner.ownerId})
      .pipe(map(stations => {
        return stations.map(s => {
          const todayTotal = s.totals[d];
          const todayNetTotal = s.netTotals[d];
          return {...s, todayNetTotal: todayNetTotal, todayTotal: todayTotal};
        })
      }));
    this.dashBoardSubscription = currentOwner.pipe(concatMap(owner => stationsReq(owner))).pipe(
      expand(_ => timer(4000).pipe(concatMap(_ => currentOwner.pipe(concatMap(owner => stationsReq(owner))))))
    ).subscribe(stations => {
      this.dataSource$.emit(stations);
    });
    this.dataSource$.subscribe((stations) => {
      this.chartStations = stations.map((posStation: PosStation) => {
        return {name: posStation.name, series: Object.keys(posStation.totals).map(function(key) {
            return {name: key, value: posStation.totals[key] || 0};
          }).reverse()}
      });
    })
  }


  ngOnDestroy(): void {
    this.dashBoardSubscription.unsubscribe();
  }
}

