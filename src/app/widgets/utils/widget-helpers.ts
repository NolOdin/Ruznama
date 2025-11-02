import { IWidget, WidgetType, WidgetSize, WidgetPosition } from '../interfaces/widget.interface';

/**
 * Вспомогательные функции для работы с виджетами
 */
export class WidgetHelpers {
  /**
   * Создать базовую конфигурацию виджета
   */
  static createWidget(
    id: string,
    title: string,
    type: WidgetType,
    options?: {
      size?: WidgetSize;
      position?: WidgetPosition;
      config?: Record<string, any>;
      enabled?: boolean;
    }
  ): IWidget {
    return {
      id,
      title,
      type,
      size: options?.size || { width: 'auto', height: 'auto' },
      position: options?.position,
      config: options?.config || {},
      enabled: options?.enabled !== false
    };
  }

  /**
   * Создать виджет времени молитвы
   */
  static createPrayerTimeWidget(
    id: string,
    options?: {
      title?: string;
      autoRefresh?: boolean;
      showDate?: boolean;
      size?: WidgetSize;
    }
  ): IWidget {
    return this.createWidget(
      id,
      options?.title || 'Время молитв',
      WidgetType.PRAYER_TIME,
      {
        size: options?.size || { width: 350, height: 'auto' },
        config: {
          autoRefresh: options?.autoRefresh ?? true,
          showDate: options?.showDate ?? true
        }
      }
    );
  }

  /**
   * Создать виджет календаря
   */
  static createCalendarWidget(
    id: string,
    options?: {
      title?: string;
      size?: WidgetSize;
    }
  ): IWidget {
    return this.createWidget(
      id,
      options?.title || 'Календарь',
      WidgetType.CALENDAR,
      {
        size: options?.size || { width: 300, height: 300 }
      }
    );
  }

  /**
   * Генерация уникального ID для виджета
   */
  static generateWidgetId(prefix: string = 'widget'): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Валидация виджета
   */
  static validateWidget(widget: Partial<IWidget>): boolean {
    if (!widget.id || !widget.title || !widget.type) {
      return false;
    }
    return true;
  }

  /**
   * Клонировать виджет с новым ID
   */
  static cloneWidget(widget: IWidget, newId?: string): IWidget {
    return {
      ...widget,
      id: newId || this.generateWidgetId(widget.type),
      title: `${widget.title} (копия)`
    };
  }
}

