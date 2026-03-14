import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-spinner.component.html',
  styleUrls: ['./ui-spinner.component.scss']
})
export class UiSpinnerComponent {
  @Input() visible = false;
  readonly bars = Array.from({ length: 12 }, (_, i) => i);
}
