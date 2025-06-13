import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import * as ruznamaData from '../datas/ruznama_datas.json';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Ruznama';
  currentMonthData: any;
  currentDayTimestamps: string[] = [];
  currentDayNumber: string = '';
  currentMonth: string = '';
  currentYear: string = '';

  constructor() {
    this.loadCurrentMonthAndDayData();
  }

  loadCurrentMonthAndDayData() {
    const today = new Date();
    const currentMonthNum = today.getMonth();
    this.currentDayNumber = today.getDate().toString().padStart(2, '0');
    this.currentYear = today.getFullYear().toString();

    const monthNames = [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    this.currentMonth = monthNames[currentMonthNum];

    const currentMonthPadded = (currentMonthNum + 1).toString().padStart(2, '0');

    const yearData = (ruznamaData as any).default.year;
    this.currentMonthData = yearData.find((month: any) => month.mouth === currentMonthPadded);

    if (this.currentMonthData) {
      const dayData = this.currentMonthData.days.find((day: any) => day.day === this.currentDayNumber);
      if (dayData) {
        this.currentDayTimestamps = dayData.timestamps;
      }
    }
  }
}
