import { Pipe, PipeTransform } from '@angular/core';
import { WeatherService } from './weather.service';

@Pipe({
  name: 'weatherIcon',
  standalone: true,
})
export class WeatherIconPipe implements PipeTransform {
  constructor(private weatherService: WeatherService) {}

  transform(icon: number): string {
    return this.weatherService.getWeatherIcon(icon);
  }
}
