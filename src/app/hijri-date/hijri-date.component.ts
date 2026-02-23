import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { HijriDateService } from '../services/hijri-date.service';

@Component({
  selector: 'app-hijri-date',
  standalone: true,
  imports: [],
  templateUrl: './hijri-date.component.html',
  styleUrl: './hijri-date.component.scss'
})
export class HijriDateComponent {

  hijri: any = {};
  hijriEn: any = {};

  @Output() cloudClicked = new EventEmitter<void>();

  constructor(private hijriService: HijriDateService) {

  }

  ngOnInit(): void {
    const today = new Date();

    this.hijri = this.hijriService.getHijriDateParts(today, 'ar');
    this.hijriEn = this.hijriService.getHijriDateParts(today, 'en')

  }


}
