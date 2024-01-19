import { Injectable } from '@angular/core';
import { WeatherService } from './weather.service';
import { tap } from 'rxjs';

export const LOCATIONS: string = 'locations';

interface CountryCodeAndZip {
  countryCode: string;
  zip: string;
}

@Injectable()
export class LocationService {
  locations: CountryCodeAndZip[] = [];

  constructor(private weatherService: WeatherService) {
    const locString = localStorage.getItem(LOCATIONS);

    if (locString) {
      this.locations = JSON.parse(locString) as CountryCodeAndZip[];
    }

    for (const {countryCode, zip} of this.locations) {
      this.weatherService.addCurrentConditions(countryCode, zip).subscribe();
    }
  }

  addLocation(countryCode: string, zip: string) {
    return this.weatherService.addCurrentConditions(countryCode, zip).pipe(tap(() => {
      this.locations.push({ countryCode, zip });
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    }));
  }

  removeLocation(countryCode: string, zip: string) {
    let index = this.locations.findIndex(location => location.countryCode === countryCode && location.zip === zip);
    if (index !== -1) {
      this.locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
      this.weatherService.removeCurrentConditions(countryCode, zip);
    }
  }
}
