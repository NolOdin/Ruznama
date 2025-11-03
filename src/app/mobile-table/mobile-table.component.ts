import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AndroidWidgetService } from '../services/android-widget.service';

@Component({
  selector: 'app-mobile-table',
  imports: [CommonModule],
  templateUrl: './mobile-table.component.html',
  styleUrl: './mobile-table.component.scss'
})
export class MobileTableComponent implements OnInit {
  @Input() currentMonthData: any;
  @Input() currentDayTimestamps: string[] = [];
  @Input() currentDayNumber: string = '';
  @Input() currentMonth: string = '';
  @Input() currentYear: string = '';

  isWidgetSupported: boolean = false;
  isPWAInstalled: boolean = false;
  private deferredPrompt: any = null;

  constructor(private androidWidgetService: AndroidWidgetService) {}

  ngOnInit(): void {
    this.isWidgetSupported = this.androidWidgetService.isSupported();
    this.isPWAInstalled = this.androidWidgetService.isInstalled();
    
    // Перехватываем событие установки PWA
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.deferredPrompt = e;
    });
  }

  /**
   * Добавить системный виджет времени молитв для Android
   */
  async addWidget(): Promise<void> {
    if (!this.isWidgetSupported) {
      alert('Системные виджеты поддерживаются только на Android устройствах с установленным PWA.');
      return;
    }

    if (!this.isPWAInstalled) {
      const install = confirm(
        'Для использования системных виджетов приложение должно быть установлено как PWA.\n\n' +
        'Хотите установить приложение сейчас?'
      );
      
      if (install) {
        await this.installPWA();
      }
      return;
    }

    try {
      const success = await this.androidWidgetService.addPrayerTimeWidget({
        dayNumber: this.currentDayNumber,
        month: this.currentMonth,
        year: this.currentYear,
        timestamps: this.currentDayTimestamps
      });
      
      if (success) {
        alert('Виджет успешно добавлен! Проверьте главный экран устройства - виджет должен быть доступен в списке виджетов.');
      } else {
        alert('Не удалось добавить виджет. Попробуйте обновить страницу.');
      }
    } catch (error) {
      console.error('Ошибка при добавлении виджета:', error);
      alert('Произошла ошибка при добавлении виджета.');
    }
  }

  /**
   * Установить PWA
   */
  private async installPWA(): Promise<void> {
    if (this.deferredPrompt) {
      try {
        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          alert('Приложение установлено! Обновите страницу и попробуйте добавить виджет снова.');
          this.deferredPrompt = null;
          setTimeout(() => {
            this.isPWAInstalled = this.androidWidgetService.isInstalled();
          }, 1000);
        }
      } catch (error) {
        console.error('Ошибка при установке PWA:', error);
        alert('Не удалось установить приложение автоматически.');
      }
    } else {
      alert('Инструкции по установке:\n\n' +
            'Chrome: Меню (⋮) → "Установить приложение"\n' +
            'Samsung Internet: Меню → "Добавить на главный экран"\n\n' +
            'После установки обновите страницу.');
    }
  }

  /**
   * Поделиться приложением
   */
  async shareApp(): Promise<void> {
    const shareData: ShareData = {
      title: 'Рузнама с.Гертма',
      text: `Время молитв на сегодня: ${this.currentDayNumber} ${this.currentMonth} ${this.currentYear}`,
      url: window.location.href
    };

    try {
      // Проверяем поддержку Web Share API
      const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void>; canShare?: (data: ShareData) => boolean };
      
      if (nav.share && nav.canShare && nav.canShare(shareData)) {
        await nav.share(shareData);
      } else {
        // Fallback: копируем URL в буфер обмена
        await this.copyToClipboard(window.location.href);
        alert('Ссылка скопирована в буфер обмена!');
      }
    } catch (error) {
      // Пользователь отменил или произошла ошибка
      if ((error as Error).name !== 'AbortError') {
        // Если не отмена, пробуем скопировать в буфер
        try {
          await this.copyToClipboard(window.location.href);
          alert('Ссылка скопирована в буфер обмена!');
        } catch (copyError) {
          console.error('Ошибка при копировании:', copyError);
          alert('Не удалось поделиться. Попробуйте скопировать ссылку вручную.');
        }
      }
    }
  }

  /**
   * Копировать текст в буфер обмена
   */
  private async copyToClipboard(text: string): Promise<void> {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback для старых браузеров
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }
}
