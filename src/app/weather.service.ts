import { Injectable, Signal, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { CurrentConditions } from './current-conditions/current-conditions.type';
import { ConditionsAndZip } from './conditions-and-zip.type';
import { Forecast } from './forecasts-list/forecast.type';

const URL = 'https://api.openweathermap.org/data/2.5';
const APPID = '5a4b2d457ecbef9eb2a71e480b947604';
const ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';

@Injectable()
export class WeatherService {
  private currentConditions = signal<ConditionsAndZip[]>([]);
  private updatingConditions = signal<boolean>(false);

  constructor(private http: HttpClient) {
  }

  getUpdatingConditions(): Signal<boolean> {
    return this.updatingConditions.asReadonly();
  }

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditions.asReadonly();
  }

  addCurrentConditions(countryCode: string, zip: string) {
    const params = new HttpParams()
      .set('zip', `${zip},${countryCode}`)
      .set('units', 'imperial')
      .set('cnt', '5')
      .set('APPID', APPID);

    return this.http.get<CurrentConditions>(`${URL}/weather`, { params })
      .pipe(tap(data => {
        this.currentConditions.update(conditions => [...conditions, { countryCode, zip, data }]);
      }));
  }

  removeCurrentConditions(countryCode: string, zip: string) {
    this.currentConditions.update(conditions => {
      for (const i in conditions) {
        if (conditions[i].zip === zip && conditions[i].countryCode === countryCode) {
          conditions.splice(+i, 1);
        }
      }
      return conditions;
    });
  }

  updateWeather() {
    this.updatingConditions.update(() => true);

    this.currentConditions.update(conditions => {
      for (const condition in conditions) {
        const params = new HttpParams()
          .set('zip', `${conditions[condition].zip},${conditions[condition].countryCode}`)
          .set('units', 'imperial')
          .set('cnt', '5')
          .set('APPID', APPID);

        this.http.get<CurrentConditions>(`${URL}/weather`, { params })
          .subscribe(data => conditions[condition].data = data);
      }

      this.updatingConditions.update(() => false);

      return conditions;
    });
  }

  getForecast(code: string, zipcode: string): Observable<Forecast> {
    const params = new HttpParams()
      .set('zip', `${zipcode},${code}`)
      .set('units', 'imperial')
      .set('cnt', '5')
      .set('APPID', APPID);

    return this.http.get<Forecast>(`${URL}/forecast/daily`, { params });
  }

  getWeatherIcon(id: number): string {
    if (id >= 200 && id <= 232) {
      return ICON_URL + 'art_storm.png';
    } else if (id >= 501 && id <= 511) {
      return ICON_URL + 'art_rain.png';
    } else if (id === 500 || (id >= 520 && id <= 531)) {
      return ICON_URL + 'art_light_rain.png';
    } else if (id >= 600 && id <= 622) {
      return ICON_URL + 'art_snow.png';
    } else if (id >= 801 && id <= 804) {
      return ICON_URL + 'art_clouds.png';
    } else if (id === 741 || id === 761) {
      return ICON_URL + 'art_fog.png';
    } else {
      return ICON_URL + 'art_clear.png';
    }
  }

}
