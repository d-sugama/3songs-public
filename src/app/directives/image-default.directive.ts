import { Directive, Input, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: 'img[default]'
})
export class ImageDefaultDirective {
  @Input() default?: string;
  @HostBinding('attr.src') @Input() src?: string;

  @HostListener('error') updateSrc() {
    this.src = this.default;
  }
}
