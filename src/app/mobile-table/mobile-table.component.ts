import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mobile-table',
  imports: [],
  templateUrl: './mobile-table.component.html',
  styleUrl: './mobile-table.component.scss'
})
export class MobileTableComponent {
  @Input() currentMonthData: any;
  @Input() currentDayTimestamps: string[] = [];
  @Input() currentDayNumber: string = '';
  @Input() currentMonth: string = '';
  @Input() currentYear: string = '';

}
