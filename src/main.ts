import 'zone.js/dist/zone';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';

import { race, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { RandomNumberService } from './random-number.service';
import { NewComponentComponent } from './new-component/new-component.component';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, HttpClientModule, NewComponentComponent],
  template: `
    <h1>Hello from {{name}}!</h1>
    <a target="_blank" href="https://angular.io/start">
      Learn more about Angular 
    </a>

    <div>
      <button (click)="getNumber()">Get a Random Number</button>
    </div>

    <div>
      <button (click)="getNumberCachedVersionComponentWise()">Get a Random Number(Component Cached)</button>
    </div>

    <div>
      <button (click)="getNumberCachedVersionServiceWise()">Get a Random Number(Service Cached)</button>
    </div>

    <div>
      <button (click)="clearServiceCache()">Clear Service Cache</button>
    </div>

    <app-new-component></app-new-component>
  `,
  providers: [RandomNumberService],
})
export class App {
  name = 'Angular';

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

  clearServiceCache() {
    this.randomNumberService.clearCache();
    alert('Done');
  }
}

bootstrapApplication(App);
