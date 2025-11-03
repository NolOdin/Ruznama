import { Injectable } from '@angular/core';

/**
 * Интерфейс данных виджета времени молитв
 */
export interface PrayerTimeWidgetData {
  dayNumber: string;
  month: string;
  year: string;
  timestamps: string[];
}

/**
 * Сервис для управления системными виджетами Android
 * Использует Web App Manifest API для регистрации виджетов на главном экране
 */
@Injectable({
  providedIn: 'root'
})
export class AndroidWidgetService {
  private storageKey = 'ruznama-android-widgets';

  constructor() {}

  /**
   * Проверить поддержку системных виджетов
   */
  isSupported(): boolean {
    return this.isAndroid() && 'serviceWorker' in navigator;
  }

  /**
   * Проверить, установлено ли PWA
   */
  isInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }

  /**
   * Проверка Android устройства
   */
  private isAndroid(): boolean {
    return /Android/i.test(navigator.userAgent);
  }

  /**
   * Добавить виджет времени молитв на главный экран
   */
  async addPrayerTimeWidget(data: PrayerTimeWidgetData): Promise<boolean> {
    try {
      if (!this.isSupported()) {
        throw new Error('Виджеты не поддерживаются на данном устройстве');
      }

      // Обновляем манифест с виджетом
      const success = await this.updateManifestWithWidget(data);
      
      if (success) {
        // Сохраняем информацию о виджете
        this.saveWidgetData({
          id: `prayer-time-${Date.now()}`,
          type: 'prayer-time',
          data: data,
          createdAt: new Date().toISOString()
        });

        // Перезагружаем манифест
        await this.reloadManifest();
      }

      return success;
    } catch (error) {
      console.error('Ошибка при добавлении виджета:', error);
      return false;
    }
  }

  /**
   * Обновить манифест с виджетом
   */
  private async updateManifestWithWidget(data: PrayerTimeWidgetData): Promise<boolean> {
    try {
      // Загружаем текущий манифест
      const manifestResponse = await fetch('/manifest.webmanifest');
      if (!manifestResponse.ok) {
        throw new Error('Не удалось загрузить манифест');
      }

      const manifest = await manifestResponse.json();
      
      // Создаем конфигурацию виджета для Android
      const widget = {
        name: 'Время молитв',
        tag: 'prayer-time',
        enabled: true,
        data: {
          dayNumber: data.dayNumber,
          month: data.month,
          year: data.year,
          timestamps: data.timestamps,
          prayerNames: ['Фаджр', 'Восход', 'Зухр', 'Аср', 'Магриб', 'Иша']
        },
        template: 'prayer-time-template',
        msgs: [
          {
            lang: 'ru',
            name: 'Время молитв'
          }
        ],
        screenshots: [],
        icons: manifest.icons || []
      };

      // Добавляем виджеты в манифест
      if (!manifest.widgets) {
        manifest.widgets = [];
      }

      // Проверяем, нет ли уже такого виджета
      const existingIndex = manifest.widgets.findIndex((w: any) => w.tag === 'prayer-time');
      if (existingIndex >= 0) {
        manifest.widgets[existingIndex] = widget;
      } else {
        manifest.widgets.push(widget);
      }

      // Сохраняем обновленный манифест в localStorage для использования
      localStorage.setItem('ruznama-manifest-cache', JSON.stringify(manifest));
      
      // Отправляем манифест на сервер (если доступен API)
      // В продакшене это должно происходить через API
      console.log('Виджет добавлен в манифест:', widget);
      
      return true;
    } catch (error) {
      console.error('Ошибка при обновлении манифеста:', error);
      return false;
    }
  }

  /**
   * Перезагрузить манифест в браузере
   */
  private async reloadManifest(): Promise<void> {
    try {
      // Обновляем ссылку на манифест для принудительного обновления
      const link = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
      if (link) {
        const href = link.href;
        link.href = '';
        
        // Небольшая задержка для гарантии обновления
        setTimeout(() => {
          link.href = href.split('?')[0] + '?v=' + Date.now();
        }, 100);
      }
    } catch (error) {
      console.error('Ошибка при перезагрузке манифеста:', error);
    }
  }

  /**
   * Сохранить данные виджета
   */
  private saveWidgetData(widget: any): void {
    try {
      const widgets = this.getWidgets();
      widgets.push(widget);
      localStorage.setItem(this.storageKey, JSON.stringify(widgets));
    } catch (error) {
      console.error('Ошибка при сохранении виджета:', error);
    }
  }

  /**
   * Получить все сохраненные виджеты
   */
  getWidgets(): any[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Ошибка при загрузке виджетов:', error);
      return [];
    }
  }

  /**
   * Удалить виджет
   */
  async removeWidget(widgetId: string): Promise<boolean> {
    try {
      const widgets = this.getWidgets().filter((w: any) => w.id !== widgetId);
      localStorage.setItem(this.storageKey, JSON.stringify(widgets));

      // Обновляем манифест (удаляем виджет)
      const manifestResponse = await fetch('/manifest.webmanifest');
      if (manifestResponse.ok) {
        const manifest = await manifestResponse.json();
        if (manifest.widgets) {
          manifest.widgets = manifest.widgets.filter((w: any) => {
            const widget = widgets.find((saved: any) => saved.tag === w.tag);
            return widget !== undefined;
          });
          localStorage.setItem('ruznama-manifest-cache', JSON.stringify(manifest));
          await this.reloadManifest();
        }
      }

      return true;
    } catch (error) {
      console.error('Ошибка при удалении виджета:', error);
      return false;
    }
  }
}

