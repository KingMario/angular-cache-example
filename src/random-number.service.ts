import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { race, ReplaySubject, tap } from 'rxjs';
import { map } from 'rxjs/operators';

/***
 * Service to get a random number from https://mockaroo.com
 *
 * *maximum 200 calls per day*
 */
@Injectable()
export class RandomNumberService {
  constructor(private http: HttpClient) {}

  #number$ = this.newCache;

  private get newCache() {
    return new ReplaySubject<number>(1);
  }

  clearCache() {
    this.#number$ = this.newCache;
  }

  getNumber() {
    return this.http
      .get<{ number: number }>(
        'https://my.api.mockaroo.com/random-number?key=cd8d7fa0'
      )
      .pipe(map(({ number }) => number));
  }

  getNumberCachedVersion() {
    return race(
      this.#number$,
      this.getNumber().pipe(tap((number) => this.#number$.next(number)))
    );
  }

  getNumberCachedVersionWithRefreshParameter(refresh: boolean = false) {
    if (refresh) {
      this.clearCache();
    }

    return this.getNumberCachedVersion();
  }
}
