// src/app/services/hijri-date.service.ts
import { Injectable } from '@angular/core';
import { toHijri } from 'hijri-converter';

@Injectable({
  providedIn: 'root'
})
export class HijriDateService {
  private isIntlHijriSupportedCache: boolean | null = null;

  private hijriMonthsAr = [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر',
    'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
    'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ];

  private hijriMonthsEn = [
    'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
    'Jumada al-Ula', 'Jumada al-Akhirah', 'Rajab', 'Sha’ban',
    'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah'
  ];

  private isIntlHijriSupported(): boolean {
    if (this.isIntlHijriSupportedCache !== null) return this.isIntlHijriSupportedCache;

    try {
      const testDate = new Date(2026, 0, 6); // 6 января 2026 → должно быть Rajab
      const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
        month: 'long'
      });
      const monthName = formatter.format(testDate);

      // Проверяем, содержит ли название месяца что-то характерное для хиджры (Rajab, Muharram и т.д.)
      const hijriMonthPattern = /(Muharram|Safar|Rabi|Jumada|Rajab|Sha|Ramadan|Shawwal|Dhu|Dhul)/i;
      this.isIntlHijriSupportedCache = hijriMonthPattern.test(monthName);
    } catch {
      this.isIntlHijriSupportedCache = false;
    }
    return this.isIntlHijriSupportedCache;
  }

  /** Возвращает объект с разбивкой: day, monthName, year, full */
  getHijriDateParts(
    date: Date = new Date(),
    locale: 'ar' | 'en' = 'ar'
  ): { day: string; monthName: string; year: string; full: string } {
    if (this.isIntlHijriSupported()) {
      try {
        const localeStr = locale === 'ar' ? 'ar-SA' : 'en';
        const formatter = new Intl.DateTimeFormat(`${localeStr}-u-ca-islamic-umalqura`, {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });

        const parts = formatter.formatToParts(date);

        const day = parts.find(p => p.type === 'day')?.value || '';
        const monthName = parts.find(p => p.type === 'month')?.value || '';
        const year = parts.find(p => p.type === 'year')?.value || '';

        return {
          day,
          monthName,
          year,
          full: formatter.format(date)
        };
      } catch (e) {
        // fallback если Intl вдруг сломался
      }
    }

    // Fallback на hijri-converter
    const h = toHijri(date.getFullYear(), date.getMonth() + 1, date.getDate());

    const dayRaw = h.hd.toString();
    const yearRaw = h.hy.toString();

    const day = locale === 'ar'
      ? dayRaw.replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)])
      : dayRaw;

    const year = locale === 'ar'
      ? yearRaw.replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)])
      : yearRaw;

    const monthName = locale === 'ar'
      ? this.hijriMonthsAr[h.hm - 1]
      : this.hijriMonthsEn[h.hm - 1];

    const suffix = locale === 'ar' ? ' هـ' : ' AH';
    const full = `${day} ${monthName} ${year}${suffix}`;

    return { day, monthName, year, full };
  }

  /** Старый метод для совместимости — полная строка */
  getHijriDate(date: Date = new Date(), locale: 'ar' | 'en' = 'ar'): string {
    return this.getHijriDateParts(date, locale).full;
  }
}