import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA, ComponentRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { WidgetService } from '../services/widget.service';
import { IWidget, WidgetType } from '../interfaces/widget.interface';
import { WidgetPlaceholderComponent } from '../widget-placeholder/widget-placeholder.component';
import { WidgetFactory } from '../utils/widget-factory';
import { PrayerTimeWidgetComponent } from '../examples/prayer-time-widget/prayer-time-widget.component';

@Component({
  selector: 'app-widgets-container',
  standalone: true,
  imports: [CommonModule, WidgetPlaceholderComponent, PrayerTimeWidgetComponent],
  templateUrl: './widgets-container.component.html',
  styleUrl: './widgets-container.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WidgetsContainerComponent implements OnInit, OnDestroy {
  widgets: IWidget[] = [];
  widgetComponents = new Map<string, ComponentRef<any>>();
  private destroy$ = new Subject<void>();

  // Данные для передачи в виджеты (можно получать через Input или сервис)
  @Input() currentDayTimestamps: string[] = [];
  @Input() currentDayNumber: string = '';
  @Input() currentMonth: string = '';
  @Input() currentYear: string = '';

  constructor(private widgetService: WidgetService) {}

  ngOnInit(): void {
    this.widgetService.widgets$
      .pipe(takeUntil(this.destroy$))
      .subscribe(widgets => {
        const enabledWidgets = this.widgetService.getEnabledWidgets();
        this.widgets = enabledWidgets;
      });
  }

  ngOnDestroy(): void {
    // Очистка всех созданных компонентов
    this.widgetComponents.forEach(component => component.destroy());
    this.widgetComponents.clear();
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByWidgetId(index: number, widget: IWidget): string {
    return widget.id;
  }

  readonly widgetType = WidgetType;

  getWidgetStyles(widget: IWidget): Record<string, string> {
    const styles: Record<string, string> = {};
    
    if (widget.size) {
      if (widget.size.width === 'full') {
        styles['width'] = '100%';
      } else if (widget.size.width === 'auto') {
        styles['width'] = 'auto';
      } else if (typeof widget.size.width === 'number') {
        styles['width'] = `${widget.size.width}px`;
      }

      if (widget.size.height === 'full') {
        styles['height'] = '100%';
      } else if (widget.size.height === 'auto') {
        styles['height'] = 'auto';
      } else if (typeof widget.size.height === 'number') {
        styles['height'] = `${widget.size.height}px`;
      }

      if (widget.size.minWidth) {
        styles['min-width'] = `${widget.size.minWidth}px`;
      }
      if (widget.size.minHeight) {
        styles['min-height'] = `${widget.size.minHeight}px`;
      }
      if (widget.size.maxWidth) {
        styles['max-width'] = `${widget.size.maxWidth}px`;
      }
      if (widget.size.maxHeight) {
        styles['max-height'] = `${widget.size.maxHeight}px`;
      }
    }

    if (widget.position) {
      if (widget.position.x !== undefined) {
        styles['grid-column'] = `span ${widget.position.col || 1}`;
      }
      if (widget.position.y !== undefined) {
        styles['grid-row'] = `span ${widget.position.row || 1}`;
      }
    }

    return styles;
  }

  /**
   * Получить компонент виджета по типу
   */
  getWidgetComponentType(widget: IWidget): any {
    const componentType = WidgetFactory.getWidgetComponent(widget.type);
    return componentType || WidgetPlaceholderComponent;
  }

  /**
   * Проверить, нужно ли передавать данные в виджет
   */
  shouldPassData(widgetType: WidgetType): boolean {
    return widgetType === WidgetType.PRAYER_TIME;
  }
}

