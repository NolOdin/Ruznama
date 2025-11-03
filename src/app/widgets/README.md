# Система виджетов Ruznama

Документация по использованию системы виджетов в проекте Ruznama.

## Структура

```
widgets/
├── interfaces/          # Интерфейсы и типы
├── services/            # Сервисы для управления виджетами
├── base/                # Базовые классы
├── widgets-container/   # Контейнер для отображения виджетов
├── widget-placeholder/  # Заглушка для виджетов
├── examples/            # Примеры виджетов
├── utils/               # Утилиты
└── index.ts             # Экспорты
```

## Создание нового виджета

### 1. Создайте компонент виджета

```typescript
import { Component } from '@angular/core';
import { WidgetBaseComponent } from '../../base/widget-base.component';
import { WidgetService } from '../../services/widget.service';
import { IWidget } from '../../interfaces/widget.interface';

@Component({
  selector: 'app-my-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-widget.component.html',
  styleUrl: './my-widget.component.scss'
})
export class MyWidgetComponent extends WidgetBaseComponent {
  constructor(widgetService: WidgetService) {
    super(widgetService);
  }

  protected onWidgetInit(widget: IWidget): void {
    // Инициализация виджета
    const configValue = this.getConfigValue('myKey', 'defaultValue');
  }
}
```

### 2. Зарегистрируйте виджет в WidgetFactory

```typescript
// src/app/widgets/utils/widget-factory.ts
import { MyWidgetComponent } from '../my-widget/my-widget.component';

WidgetFactory.registerWidget(WidgetType.MY_WIDGET, MyWidgetComponent);
```

### 3. Добавьте тип виджета в enum

```typescript
// src/app/widgets/interfaces/widget.interface.ts
export enum WidgetType {
  // ... существующие типы
  MY_WIDGET = 'my-widget'
}
```

### 4. Создайте виджет через сервис

```typescript
import { WidgetService } from './widgets';
import { WidgetType } from './widgets';

constructor(private widgetService: WidgetService) {}

addMyWidget() {
  this.widgetService.addWidget({
    id: 'my-widget-1',
    title: 'Мой виджет',
    type: WidgetType.MY_WIDGET,
    enabled: true,
    size: {
      width: 300,
      height: 200
    },
    config: {
      myKey: 'myValue'
    }
  });
}
```

## Использование WidgetService

### Добавление виджета

```typescript
this.widgetService.addWidget({
  id: 'unique-id',
  title: 'Название виджета',
  type: WidgetType.PRAYER_TIME,
  enabled: true,
  size: { width: 'auto', height: 'auto' },
  config: { /* конфигурация */ }
});
```

### Получение виджетов

```typescript
// Все виджеты
const widgets = this.widgetService.getWidgets();

// Включенные виджеты
const enabledWidgets = this.widgetService.getEnabledWidgets();

// По типу
const prayerWidgets = this.widgetService.getWidgetsByType(WidgetType.PRAYER_TIME);

// По ID
const widget = this.widgetService.getWidgetById('widget-id');
```

### Обновление виджета

```typescript
// Обновить виджет
this.widgetService.updateWidget('widget-id', {
  title: 'Новое название',
  enabled: false
});

// Обновить конфигурацию
this.widgetService.updateWidgetConfig('widget-id', {
  key: 'value'
});

// Обновить размер
this.widgetService.updateWidgetSize('widget-id', {
  width: 400,
  height: 300
});

// Обновить позицию
this.widgetService.updateWidgetPosition('widget-id', {
  x: 0,
  y: 0,
  row: 1,
  col: 2
});
```

### Удаление виджета

```typescript
this.widgetService.removeWidget('widget-id');
```

## Отображение виджетов

Используйте компонент `WidgetsContainerComponent`:

```typescript
import { WidgetsContainerComponent } from './widgets';

@Component({
  imports: [WidgetsContainerComponent],
  template: '<app-widgets-container></app-widgets-container>'
})
```

## Сохранение состояния

Виджеты автоматически сохраняются в `localStorage` при любых изменениях и восстанавливаются при загрузке приложения.

## Базовый класс WidgetBaseComponent

Все виджеты должны наследоваться от `WidgetBaseComponent`, который предоставляет:

- `widgetId` - ID виджета (передается через Input)
- `widget` - объект виджета
- `onWidgetInit(widget)` - вызывается при инициализации
- `onWidgetUpdate(widget)` - вызывается при обновлении (можно переопределить)
- `updateConfig(config)` - обновить конфигурацию виджета
- `getConfigValue(key, defaultValue)` - получить значение конфигурации

