import type { GridState, GridAction, Column } from './types';
export type { GridState, GridAction };
export declare const createInitialState: (columns: Column[], pageSize?: number) => GridState;
export declare const gridReducer: (state: GridState, action: GridAction) => GridState;
