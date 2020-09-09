import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../core';
import {selectServerUrl} from '../core/common/common.selectors';
import {Electron} from '../electron/electron';

@Injectable()
export class PosService {
  ipcRenderer: Electron.IpcRenderer;

  constructor(private store: Store<AppState>) {
    this.store.pipe(select(selectServerUrl)).subscribe(location => {
      if (window['konzo']){
         const {ipcRenderer} = window['konzo'].electron;
         this.ipcRenderer = ipcRenderer;
      }
      console.log(this.ipcRenderer);
    });
  }

}
