import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetBaseComponent } from '../../base/widget-base.component';
import { WidgetService } from '../../services/widget.service';
import { IWidget } from '../../interfaces/widget.interface';

@Component({
  selector: 'app-prayer-time-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prayer-time-widget.component.html',
  styleUrl: './prayer-time-widget.component.scss'
})
export class PrayerTimeWidgetComponent extends WidgetBaseComponent implements OnInit {
  @Input() currentMonthData: any;
  @Input() currentDayTimestamps: string[] = [];
  @Input() currentDayNumber: string = '';
  @Input() currentMonth: string = '';
  @Input() currentYear: string = '';

  timestamps: string[] = [];
  displayDayNumber: string = '';
  displayMonth: string = '';
  displayYear: string = '';

  constructor(widgetService: WidgetService) {
    super(widgetService);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    
    // Используем данные из Input, если они переданы
    if (this.currentDayTimestamps.length > 0) {
      this.timestamps = this.currentDayTimestamps;
      this.displayDayNumber = this.currentDayNumber;
      this.displayMonth = this.currentMonth;
      this.displayYear = this.currentYear;
    }
  }

  protected onWidgetInit(widget: IWidget): void {
    // Если данные не переданы через Input, загружаем самостоятельно
    if (this.timestamps.length === 0) {
      this.loadPrayerTimes();
    }
    
    // Можно получать данные из конфигурации виджета
    const autoRefresh = this.getConfigValue('autoRefresh', true);
    const showDate = this.getConfigValue('showDate', true);
    
    if (autoRefresh) {
      // Логика автообновления может быть добавлена здесь
      // Например, обновление каждый час или при изменении дня
    }
  }

  private loadPrayerTimes(): void {
    // Здесь должна быть логика загрузки времени молитв
    // Можно использовать данные из app.component или загрузить отдельно
    const today = new Date();
    this.displayDayNumber = today.getDate().toString().padStart(2, '0');
    this.displayYear = today.getFullYear().toString();

    const monthNames = [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    this.displayMonth = monthNames[today.getMonth()];

    // Пример данных - в реальности нужно загрузить из источника данных
    // или получить через Input от родительского компонента
  }

  getPrayerName(index: number): string {
    const names = ['Фаджр', 'Восход', 'Зухр', 'Аср', 'Магриб', 'Иша'];
    return names[index] || `Молитва ${index + 1}`;
  }
}
