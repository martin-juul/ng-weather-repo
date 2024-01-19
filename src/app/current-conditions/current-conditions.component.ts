import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';
import { LocationService } from '../location.service';
import { Router } from '@angular/router';
import { interval, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css'],
})
export class CurrentConditionsComponent implements OnInit, OnDestroy {
  weatherService = inject(WeatherService);
  updatingWeather = this.weatherService.getUpdatingConditions();
  currentConditionsByZip = this.weatherService.getCurrentConditions();

  private locationService = inject(LocationService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  showForecast(countryCode: string, zipcode: string) {
    this.router.navigate(['/forecast', countryCode, zipcode]);
  }

  removeLocation(countryCode: string, zipcode: string) {
    this.locationService.removeLocation(countryCode, zipcode);
  }

  ngOnInit() {
    this.weatherService.updateWeather()

    interval(30_000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.weatherService.updateWeather());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
