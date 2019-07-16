import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'toSafeData',
})
export class ToSafeDataPipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) {}
  transform(base64: string) {
    return !base64 ? '' : this.domSanitizer.bypassSecurityTrustResourceUrl(base64);
  }
}
