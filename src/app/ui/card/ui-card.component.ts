import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-ui-card',
  standalone: true,
  template: `<ng-content></ng-content>`,
  styleUrls: ['./ui-card.component.scss'],
})
export class UiCardComponent {
  @Input() elevated = true;
  @Input() padding: 'none' | 'sm' | 'md' | 'lg' = 'md';

  @HostBinding('class.ui-card-base') baseClass = true;

  @HostBinding('class.ui-card-flat')
  get flat() {
    return !this.elevated;
  }

  @HostBinding('class.ui-card-padding-none')
  get paddingNone() {
    return this.padding === 'none';
  }

  @HostBinding('class.ui-card-padding-sm')
  get paddingSm() {
    return this.padding === 'sm';
  }

  @HostBinding('class.ui-card-padding-lg')
  get paddingLg() {
    return this.padding === 'lg';
  }
}


