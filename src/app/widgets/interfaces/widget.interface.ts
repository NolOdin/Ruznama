/**
 * Базовый интерфейс для всех виджетов
 */
export interface IWidget {
  id: string;
  title: string;
  type: WidgetType;
  position?: WidgetPosition;
  size?: WidgetSize;
  config?: Record<string, any>;
  enabled?: boolean;
}

/**
 * Типы виджетов
 */
export enum WidgetType {
  PRAYER_TIME = 'prayer-time',
  CALENDAR = 'calendar',
  WEATHER = 'weather',
  CUSTOM = 'custom'
}

/**
 * Позиция виджета
 */
export interface WidgetPosition {
  x: number;
  y: number;
  row?: number;
  col?: number;
}

/**
 * Размер виджета
 */
export interface WidgetSize {
  width: number | 'auto' | 'full';
  height: number | 'auto' | 'full';
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

/**
 * Конфигурация виджета
 */
export interface WidgetConfig {
  [key: string]: any;
}

/**
 * Метаданные виджета
 */
export interface WidgetMetadata {
  name: string;
  description: string;
  version: string;
  author?: string;
  icon?: string;
  category?: string;
}

