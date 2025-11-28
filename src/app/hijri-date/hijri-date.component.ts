import { Component } from '@angular/core';

@Component({
  selector: 'app-hijri-date',
  imports: [],
  templateUrl: './hijri-date.component.html',
  styleUrl: './hijri-date.component.scss'
})
export class HijriDateComponent {

  day = ''
  month = ''
  year = ''

  h_date() {
    const today = new Date();
    this.day = today.toLocaleDateString('en-u-ca-islamic-umalqura', { day: 'numeric', calendar: 'islamic-umalqura' });
    this.month = today.toLocaleDateString('en-u-ca-islamic-umalqura', { month: 'long', calendar: 'islamic-umalqura' });
    this.year = today.toLocaleDateString('en-u-ca-islamic-umalqura', { year: 'numeric', calendar: 'islamic-umalqura' });
    this.year = this.year.replace('AH', 'H.')

    console.log(this.year)
    // Форматирование даты на арабском языке
    //   const hijriDateArabic = today.toLocaleDateString('ar-SA',  {
    //     weekday: 'long',
    //     year: 'numeric',
    //     month: 'long',
    //     day: 'numeric',
    //     calendar: 'islamic-umalqura' // Указываем исламский календарь Умм аль-Кура
    // });
    // this.ardate = hijriDateArabic
    // Пример вывода: الجمعة، 7 جمادى الآخرة 1447 هـ

  }

  constructor() {
    this.h_date();
  }

}
