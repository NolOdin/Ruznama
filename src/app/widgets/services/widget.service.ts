import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IWidget, WidgetType, WidgetConfig } from '../interfaces/widget.interface';

@Injectable({
  providedIn: 'root'
})
export class WidgetService {
  private widgetsSubject = new BehaviorSubject<IWidget[]>([]);
  public widgets$: Observable<IWidget[]> = this.widgetsSubject.asObservable();

  private storageKey = 'ruznama-widgets';

  constructor() {
    this.loadWidgets();
  }

  /**
   * Получить все виджеты
   */
  getWidgets(): IWidget[] {
    return this.widgetsSubject.value;
  }

  /**
   * Получить виджет по ID
   */
  getWidgetById(id: string): IWidget | undefined {
    return this.widgetsSubject.value.find(w => w.id === id);
  }

  /**
   * Добавить виджет
   */
  addWidget(widget: IWidget): void {
    const widgets = [...this.widgetsSubject.value, widget];
    this.updateWidgets(widgets);
  }

  /**
   * Обновить виджет
   */
  updateWidget(id: string, updates: Partial<IWidget>): void {
    const widgets = this.widgetsSubject.value.map(w =>
      w.id === id ? { ...w, ...updates } : w
    );
    this.updateWidgets(widgets);
  }

  /**
   * Удалить виджет
   */
  removeWidget(id: string): void {
    const widgets = this.widgetsSubject.value.filter(w => w.id !== id);
    this.updateWidgets(widgets);
  }

  /**
   * Переключить видимость виджета
   */
  toggleWidget(id: string): void {
    const widget = this.getWidgetById(id);
    if (widget) {
      this.updateWidget(id, { enabled: !widget.enabled });
    }
  }

  /**
   * Обновить позицию виджета
   */
  updateWidgetPosition(id: string, position: IWidget['position']): void {
    this.updateWidget(id, { position });
  }

  /**
   * Обновить размер виджета
   */
  updateWidgetSize(id: string, size: IWidget['size']): void {
    this.updateWidget(id, { size });
  }

  /**
   * Обновить конфигурацию виджета
   */
  updateWidgetConfig(id: string, config: WidgetConfig): void {
    this.updateWidget(id, { config });
  }

  /**
   * Получить только включенные виджеты
   */
  getEnabledWidgets(): IWidget[] {
    return this.widgetsSubject.value.filter(w => w.enabled !== false);
  }

  /**
   * Получить виджеты по типу
   */
  getWidgetsByType(type: WidgetType): IWidget[] {
    return this.widgetsSubject.value.filter(w => w.type === type);
  }

  /**
   * Обновить виджеты и сохранить в localStorage
   */
  private updateWidgets(widgets: IWidget[]): void {
    this.widgetsSubject.next(widgets);
    this.saveWidgets(widgets);
  }

  /**
   * Сохранить виджеты в localStorage
   */
  private saveWidgets(widgets: IWidget[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(widgets));
    } catch (error) {
      console.error('Ошибка при сохранении виджетов:', error);
    }
  }

  /**
   * Загрузить виджеты из localStorage
   */
  private loadWidgets(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const widgets = JSON.parse(stored);
        this.widgetsSubject.next(widgets);
      }
    } catch (error) {
      console.error('Ошибка при загрузке виджетов:', error);
    }
  }

  /**
   * Сбросить все виджеты
   */
  resetWidgets(): void {
    this.updateWidgets([]);
  }
}

