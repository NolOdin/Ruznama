import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-ui-button',
  standalone: true,
  template: `<ng-content></ng-content>`,
  styleUrls: ['./ui-button.component.scss'],
})
export class UiButtonComponent {
  @Input() variant: 'primary' | 'ghost' | 'outline' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() fullWidth = false;

  @HostBinding('class.ui-button-base') baseClass = true;

  @HostBinding('class.ui-button-primary')
  get primary() {
    return this.variant === 'primary';
  }

  @HostBinding('class.ui-button-ghost')
  get ghost() {
    return this.variant === 'ghost';
  }

  @HostBinding('class.ui-button-outline')
  get outline() {
    return this.variant === 'outline';
  }

  @HostBinding('class.ui-button-sm')
  get small() {
    return this.size === 'sm';
  }

  @HostBinding('class.ui-button-lg')
  get large() {
    return this.size === 'lg';
  }

  @HostBinding('class.ui-button-full')
  get isFullWidth() {
    return this.fullWidth;
  }
}


