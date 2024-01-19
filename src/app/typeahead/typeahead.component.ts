import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeValuePipe } from '../safe-value.pipe';

export interface LabelValue {
  value: string;
  label: string;
}

@Component({
  selector: 'app-typeahead',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    SafeValuePipe,
  ],
  template: `
    <input
      type="text"
      class="form-control"
      #typeahead [formControl]="control"
    />

    <div class="typeahead" *ngIf="typeAheadItems?.length > 0">
      <div
        class="typeahead-item"
        [innerHTML]="item.label | safeValue"
        (click)="onItemSelected(item)"
        *ngFor="let item of typeAheadItems"
      ></div>
    </div>
  `,
  styles: `
    .typeahead {
      background-color: #fff;
      position: absolute;
      max-height: 200px;
      width: 250px;
      overflow-y: scroll;
    }
    
    .typeahead-item {
      cursor: pointer;
      padding: 4px;
    }
    
    .typeahead-item:hover {
      background-color: #ccc;
    }
  `,
})
export class TypeaheadComponent implements OnInit {
  @Input() items: LabelValue[];
  @Output() itemSelected = new EventEmitter<LabelValue | null>();

  typeAheadItems: LabelValue[] = [];

  control = new FormControl<string>('');

  constructor() {}

  ngOnInit() {
    this.control.valueChanges.subscribe(value => {
      if (!value) {
        this.typeAheadItems = [];
        this.itemSelected.emit(null);

        return;
      }

      this.typeAheadItems = [...this.items.filter(item => item.label.toLowerCase().startsWith(value.toLowerCase()))];

      // highlight matched letters with bold
      this.typeAheadItems = this.typeAheadItems.map(item => {
        const label = item.label;
        const index = label.toLowerCase().indexOf(value.toLowerCase());
        const matched = label.slice(index, value.length);
        const rest = label.slice(index + value.length);
        return {
          ...item,
          label: `<b>${matched}</b>${rest}`,
        };
      });
    });
  }

  onItemSelected(item: LabelValue) {
    // strip html tags
    this.control.setValue(item.label.replace(/<[^>]*>/g, ''), { emitEvent: false });
    this.typeAheadItems = [];
    this.itemSelected.emit(item);
  }
}
