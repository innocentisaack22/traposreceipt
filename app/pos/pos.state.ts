import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';


import {AppState} from '../core';

export const FEATURE_NAME = 'examples';
export const selectExamples = createFeatureSelector<State, PosState>(
  FEATURE_NAME
);
export const reducers: ActionReducerMap<PosState> = {

};

// tslint:disable-next-line:no-empty-interface
export interface PosState {

}

export interface State extends AppState {
  examples: PosState;
}
