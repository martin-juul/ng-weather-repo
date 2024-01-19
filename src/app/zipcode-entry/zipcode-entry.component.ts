import { Component, inject, signal, ViewChild } from '@angular/core';
import { LocationService } from '../location.service';
import { ButtonState } from '../button/button.component';
import { catchError, delay, of, tap } from 'rxjs';
import { FormControl } from '@angular/forms';
import { countries } from '../countries';
import { LabelValue, TypeaheadComponent } from '../typeahead/typeahead.component';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html',
})
export class ZipcodeEntryComponent {
  buttonState = signal<ButtonState>('default');
  readonly countries: LabelValue[] = countries.slice().map(country => ({ value: country.code, label: country.name }));

  country: string|null = null;
  @ViewChild('typeahead') typeahead: TypeaheadComponent;
  zip = new FormControl('');

  private service = inject(LocationService);

  countrySelected(country: LabelValue) {
    this.country = country?.value ?? null;
  }

  addLocation() {
    this.buttonState.set('loading');

    const zip = this.zip;

    if (!this.country || !zip.valid || zip.value === '') {
      return;
    }

    this.service.addLocation(this.country, zip.value)
      .pipe(
        delay(500),
        tap(() => {
          this.buttonState.set('success');
        }),
        catchError(() => {
          this.buttonState.set('error');

          return of('');
        }),
        delay(500),
      ).subscribe(() => {
      this.buttonState.set('default');
      this.country = null;
      this.typeahead.reset();
      this.zip.reset();
    });
  }
}
