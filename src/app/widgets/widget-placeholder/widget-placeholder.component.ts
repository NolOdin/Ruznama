import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IWidget } from '../interfaces/widget.interface';

@Component({
  selector: 'app-widget-placeholder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './widget-placeholder.component.html',
  styleUrl: './widget-placeholder.component.scss'
})
export class WidgetPlaceholderComponent {
  @Input() widget!: IWidget;

  hasConfig(): boolean {
    return !!(this.widget?.config && Object.keys(this.widget.config).length > 0);
  }
}

