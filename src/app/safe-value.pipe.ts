import { DomSanitizer } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ standalone: true, name: 'safeValue' })
export class SafeValuePipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) {
  }

  transform(value: any): any {
    return this.domSanitizer.bypassSecurityTrustHtml(value);
  }
}
