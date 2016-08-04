import 'rxjs/add/operator/let';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/withLatestFrom';

import { StateUpdate } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';


export const applySelector = <T,V>(selector: (obs$: Observable<T>) => Observable<V>) => {
  return (update$: Observable<StateUpdate<T>>): Observable<StateUpdate<V>> => {
    const selected$ = update$
      .map(update => update.state)
      .let(selector);

    return update$
      .withLatestFrom(selected$, (update, state) => {
        return {
          action: update.action,
          state
        };
      });
  };
};


export function toState(update: StateUpdate<any>): any {
  return update.state;
}
