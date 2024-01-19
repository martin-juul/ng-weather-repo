import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

export type ButtonState = 'default' | 'loading' | 'success' | 'error'

export interface ButtonConfiguration {
  btnClass?: string;
  errorClass?: string;
  successClass?: string;
}

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [
    NgClass,
  ],
  template: `
    <button
      [class]="configuration.btnClass"
      [ngClass]="state === 'success' ? successClass : '' || state === 'error' ? errorClass : ''"
      [disabled]="state === 'loading'"
    >
      <ng-content></ng-content>
    </button>
  `,
})
export class ButtonComponent {
  @Input() state: ButtonState = 'default';

  @Input() configuration: ButtonConfiguration = {
    btnClass: 'btn btn-primary',
    errorClass: 'btn-danger',
    successClass: 'btn-success',
  };

  get errorClass() {
    return this.configuration.errorClass;
  }

  get successClass() {
    return this.configuration.successClass;
  }
}
