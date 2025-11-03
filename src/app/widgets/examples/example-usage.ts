/**
 * Примеры использования системы виджетов
 * 
 * Этот файл содержит примеры кода для демонстрации работы с виджетами
 */

import { WidgetService, WidgetHelpers, WidgetType } from '../index';

/**
 * Пример 1: Добавление виджета времени молитвы
 */
export function exampleAddPrayerTimeWidget(widgetService: WidgetService): void {
  const widget = WidgetHelpers.createPrayerTimeWidget(
    WidgetHelpers.generateWidgetId('prayer-time'),
    {
      title: 'Время молитв',
      autoRefresh: true,
      showDate: true,
      size: {
        width: 350,
        height: 'auto'
      }
    }
  );

  widgetService.addWidget(widget);
}

/**
 * Пример 2: Добавление кастомного виджета
 */
export function exampleAddCustomWidget(widgetService: WidgetService): void {
  const widget = WidgetHelpers.createWidget(
    WidgetHelpers.generateWidgetId('custom'),
    'Мой виджет',
    WidgetType.CUSTOM,
    {
      size: {
        width: 300,
        height: 200,
        minWidth: 200,
        minHeight: 150
      },
      config: {
        customSetting: 'value',
        anotherSetting: 123
      },
      enabled: true
    }
  );

  widgetService.addWidget(widget);
}

/**
 * Пример 3: Обновление конфигурации виджета
 */
export function exampleUpdateWidgetConfig(
  widgetService: WidgetService,
  widgetId: string
): void {
  widgetService.updateWidgetConfig(widgetId, {
    theme: 'dark',
    fontSize: 16,
    showNotifications: true
  });
}

/**
 * Пример 4: Переключение видимости виджета
 */
export function exampleToggleWidget(
  widgetService: WidgetService,
  widgetId: string
): void {
  widgetService.toggleWidget(widgetId);
}

/**
 * Пример 5: Получение всех включенных виджетов
 */
export function exampleGetEnabledWidgets(widgetService: WidgetService): void {
  const enabledWidgets = widgetService.getEnabledWidgets();
  console.log('Включенные виджеты:', enabledWidgets);
}

/**
 * Пример 6: Клонирование виджета
 */
export function exampleCloneWidget(
  widgetService: WidgetService,
  widgetId: string
): void {
  const originalWidget = widgetService.getWidgetById(widgetId);
  if (originalWidget) {
    const clonedWidget = WidgetHelpers.cloneWidget(originalWidget);
    widgetService.addWidget(clonedWidget);
  }
}

