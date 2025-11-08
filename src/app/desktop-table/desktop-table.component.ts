import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-desktop-table',
  imports: [],
  templateUrl: './desktop-table.component.html',
  styleUrl: './desktop-table.component.scss'
})
export class DesktopTableComponent {
  @Input() currentMonthData: any;
  @Input() currentDayTimestamps: string[] = [];
  @Input() currentDayNumber: string = '';
  @Input() currentMonth: string = '';
  @Input() currentYear: string = '';
  @Input() currentCity: string = 'Гертма';
}
