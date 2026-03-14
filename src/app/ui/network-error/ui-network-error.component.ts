import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-network-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-network-error.component.html',
  styleUrls: ['./ui-network-error.component.scss']
})
export class UiNetworkErrorComponent {
  @Input() visible = false;
  @Output() retry = new EventEmitter<void>();

  onRetry(): void {
    this.retry.emit();
  }
}
