import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  





  ngOnInit(): void {}

  
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
