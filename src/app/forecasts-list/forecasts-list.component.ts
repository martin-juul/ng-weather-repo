import { Component, inject, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';
import { ActivatedRoute } from '@angular/router';
import { Forecast } from './forecast.type';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css'],
})
export class ForecastsListComponent implements OnInit {
  countryCode: string;
  zipcode: string;
  forecast: Forecast;

  private route = inject(ActivatedRoute);
  private weatherService = inject(WeatherService);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.countryCode = params.get('countryCode');
      this.zipcode = params.get('zipCode');

      this.weatherService.getForecast(this.countryCode, this.zipcode)
        .subscribe(data => this.forecast = data);
    });
  }
}
