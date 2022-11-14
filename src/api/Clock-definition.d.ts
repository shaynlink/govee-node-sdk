export type StopOrder = ['STOP', {timeout: number, hash: string}];

export type Directive<S extends 'STOP' | 'DESTROY'> =
  S extends 'STOP' ? StopOrder : [S, boolean];

export interface Directives extends Array<Directive<'DESTROY' | 'STOP'>> {
  push(item: Directive<'DESTROY' | 'STOP'>): number;
}
