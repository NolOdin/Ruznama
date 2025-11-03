import { Type } from '@angular/core';
import { WidgetType } from '../interfaces/widget.interface';
import { PrayerTimeWidgetComponent } from '../examples/prayer-time-widget/prayer-time-widget.component';

/**
 * Фабрика для создания компонентов виджетов
 * Регистрируйте здесь новые виджеты
 */
export class WidgetFactory {
  private static widgetComponents: Map<WidgetType, Type<any>> = new Map([
    [WidgetType.PRAYER_TIME, PrayerTimeWidgetComponent],
    // Добавьте здесь другие виджеты:
    // [WidgetType.CALENDAR, CalendarWidgetComponent],
    // [WidgetType.WEATHER, WeatherWidgetComponent],
  ]);

  /**
   * Получить компонент виджета по типу
   */
  static getWidgetComponent(type: WidgetType): Type<any> | null {
    return this.widgetComponents.get(type) || null;
  }

  /**
   * Зарегистрировать новый виджет
   */
  static registerWidget(type: WidgetType, component: Type<any>): void {
    this.widgetComponents.set(type, component);
  }

  /**
   * Проверить, зарегистрирован ли виджет
   */
  static isWidgetRegistered(type: WidgetType): boolean {
    return this.widgetComponents.has(type);
  }

  /**
   * Получить все зарегистрированные типы виджетов
   */
  static getRegisteredTypes(): WidgetType[] {
    return Array.from(this.widgetComponents.keys());
  }
}

