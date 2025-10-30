import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import * as ruznamaData from '../datas/ruznama_datas.json';
import { DesktopTableComponent } from "./desktop-table/desktop-table.component";
import { MobileTableComponent } from "./mobile-table/mobile-table.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, DesktopTableComponent, MobileTableComponent],
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
  currentBackgroundClass: string = '';

  constructor() {
    this.loadCurrentMonthAndDayData();
    this.updateBackgroundClass();
  }

  private updateBackgroundClass() {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes
    
    if (this.currentDayTimestamps.length >= 6) {
      const fajrTime = this.convertTimeToMinutes(this.currentDayTimestamps[0]);
      const sunriseTime = this.convertTimeToMinutes(this.currentDayTimestamps[1]);
      const asrTime = this.convertTimeToMinutes(this.currentDayTimestamps[3]);
      const maghribTime = this.convertTimeToMinutes(this.currentDayTimestamps[4]);
      const ishaTime = this.convertTimeToMinutes(this.currentDayTimestamps[5]);

      if (currentTime >= fajrTime && currentTime < sunriseTime) {
        this.currentBackgroundClass = 'morning-bg';
      } else if (currentTime >= sunriseTime && currentTime < asrTime) {
        this.currentBackgroundClass = 'day-bg';
      } else if (currentTime >= asrTime && currentTime < maghribTime) {
        this.currentBackgroundClass = 'evening-bg';
      } else if (currentTime >= maghribTime && currentTime < ishaTime) {
        this.currentBackgroundClass = 'night-bg';
      } else if (currentTime >= ishaTime || currentTime < fajrTime) {
        this.currentBackgroundClass = 'night-bg';
      } else {
        this.currentBackgroundClass = 'day-bg';
      }
    }
  }

  private convertTimeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
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
        this.updateBackgroundClass();
      }
    }
  }
}
