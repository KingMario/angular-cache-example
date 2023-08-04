import { Component } from '@angular/core';

import { race, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { RandomNumberService } from '../random-number.service';

@Component({
  selector: 'app-new-component',
  standalone: true,
  templateUrl: './new-component.component.html',
  styleUrls: ['./new-component.component.css'],
})
export class NewComponentComponent {
  #number$ = new ReplaySubject<number>(1);

  constructor(private randomNumberService: RandomNumberService) {}

  getNumber() {
    this.randomNumberService.getNumber().subscribe(alert);
  }

  getNumberCachedVersionComponentWise() {
    race(
      this.#number$,
      this.randomNumberService
        .getNumber()
        .pipe(tap((number) => this.#number$.next(number)))
    ).subscribe(alert);
  }

  getNumberCachedVersionServiceWise() {
    this.randomNumberService.getNumberCachedVersion().subscribe(alert);
  }
}
