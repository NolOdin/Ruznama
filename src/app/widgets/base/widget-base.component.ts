import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { IWidget } from '../interfaces/widget.interface';
import { WidgetService } from '../services/widget.service';
import { Subject, takeUntil } from 'rxjs';

/**
 * Базовый класс для всех виджетов
 * Наследуйтесь от этого класса для создания новых виджетов
 */
@Component({
  template: ''
})
export abstract class WidgetBaseComponent implements OnInit, OnDestroy {
  @Input() widgetId!: string;
  
  widget?: IWidget;
  protected destroy$ = new Subject<void>();

  constructor(protected widgetService: WidgetService) {}

  ngOnInit(): void {
    if (this.widgetId) {
      this.widget = this.widgetService.getWidgetById(this.widgetId);
      
      // Подписка на обновления виджета
      this.widgetService.widgets$
        .pipe(takeUntil(this.destroy$))
        .subscribe(widgets => {
          const updatedWidget = widgets.find(w => w.id === this.widgetId);
          if (updatedWidget) {
            this.widget = updatedWidget;
            this.onWidgetUpdate(updatedWidget);
          }
        });

      if (this.widget) {
        this.onWidgetInit(this.widget);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Вызывается при инициализации виджета
   */
  protected abstract onWidgetInit(widget: IWidget): void;

  /**
   * Вызывается при обновлении виджета
   */
  protected onWidgetUpdate(widget: IWidget): void {
    // Переопределите этот метод в дочерних классах при необходимости
  }

  /**
   * Обновить конфигурацию виджета
   */
  protected updateConfig(config: Record<string, any>): void {
    if (this.widgetId) {
      this.widgetService.updateWidgetConfig(this.widgetId, config);
    }
  }

  /**
   * Получить значение конфигурации
   */
  protected getConfigValue(key: string, defaultValue?: any): any {
    return this.widget?.config?.[key] ?? defaultValue;
  }
}

