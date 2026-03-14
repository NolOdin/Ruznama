import { Component, HostListener, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import * as gertmaData from '../datas/getrma_datas.json';
import * as mkhData from '../datas/mkh_datas.json';
import { DesktopTableComponent } from './desktop-table/desktop-table.component';
import { MobileTableComponent } from './mobile-table/mobile-table.component';
import { UiButtonComponent } from './ui/button/ui-button.component';
import { UiModalComponent } from './ui/modal/ui-modal.component';
import { UiScrollWheelComponent } from './ui/scroll-wheel/ui-scroll-wheel.component';
import { LibraryService, LibraryItem } from './services/library.service';
import { UiSpinnerComponent } from './ui/spinner/ui-spinner.component';
import { UiNetworkErrorComponent } from './ui/network-error/ui-network-error.component';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, DesktopTableComponent, MobileTableComponent, UiButtonComponent, UiModalComponent, UiScrollWheelComponent, UiSpinnerComponent, UiNetworkErrorComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Ruznama';
  currentMonthData: any;
  currentDayTimestamps: string[] = [];
  currentDayNumber: string = '';
  currentMonth: string = '';
  currentYear: string = '';
  currentBackgroundClass: string = '';
  currentCity: string = 'Гертма';
  cities: string[] = ['Гертма', 'Махачкала'];
  menuOpen = false;
  mobileTopbarOpacity = 0.9;
  modalOpen = false;
  scrollWheelOpen = false;
  scrollWheelItems: string[] = [
    'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница',
    'Суббота', 'Воскресенье', 'Январь', 'Февраль', 'Март',
    'Апрель', 'Май', 'Июнь', 'Июль', 'Август',
    'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  selectedScrollIndex = 0;

  selectedItem: string | null = null;
  itemDetailsModalOpen = false;

  // Cloud modal state
  cloudModalOpen = false;
  libraryDetailModalOpen = false;
  selectedLibraryItem: LibraryItem | null = null;
  libraryItems: LibraryItem[] = [];
  libraryScrollItems: string[] = [];

  // Loading / error state (wired from LibraryService)
  libraryLoading = false;
  libraryError = false;

  private librarySubs = new Subscription();

  private readonly CITY_STORAGE_KEY = 'ruznama_selected_city';


  constructor(
    private cdr: ChangeDetectorRef,
    private libraryService: LibraryService
  ) {
    // Восстанавливаем сохраненный город из localStorage
    const savedCity = localStorage.getItem(this.CITY_STORAGE_KEY);
    if (savedCity && this.cities.includes(savedCity)) {
      this.currentCity = savedCity;
    }
    this.loadCurrentMonthAndDayData();
    this.updateBackgroundClass();
  }

  ngOnInit() {
    this.librarySubs.add(
      this.libraryService.loading$.subscribe(v => {
        this.libraryLoading = v;
        this.cdr.markForCheck();
      })
    );
    this.librarySubs.add(
      this.libraryService.error$.subscribe(v => {
        this.libraryError = v;
        this.cdr.markForCheck();
      })
    );
    this.triggerLibraryLoad();
  }

  ngOnDestroy() {
    this.librarySubs.unsubscribe();
  }

  private triggerLibraryLoad(): void {
    this.libraryService.loadLibrary().subscribe(items => {
      this.libraryItems = items;
      this.libraryScrollItems = items.map(item => item.title);
      this.cdr.markForCheck();
    });
  }

  retryLoadLibrary(): void {
    this.libraryService.reset();
    this.triggerLibraryLoad();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const y = window.scrollY || 0;
    const fadeEnd = 150; // px to fully fade out
    const clamped = Math.max(0, Math.min(1, (fadeEnd - y) / fadeEnd));
    const base = 0.9; // slightly transparent at top
    this.mobileTopbarOpacity = base * clamped;
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

  getBackgroundImage(): string {
    const isMobile = window.innerWidth <= 767;

    if (this.currentCity === 'Махачкала') {
      if (isMobile) {
        // Для мобильных устройств используем mkh_day или mkh_night в зависимости от времени
        if (this.currentBackgroundClass === 'evening-bg' || this.currentBackgroundClass === 'night-bg') {
          return 'url("/assets/mkh_night.png")';
        } else {
          return 'url("/assets/mkh_day.png")';
        }
      } else {
        // Для десктопа можно использовать тот же mkh_day или создать отдельный файл
        return 'url("/assets/mkh_day.png")';
      }
    } else {
      // Для Гертмы используем существующие изображения
      if (isMobile) {
        if (this.currentBackgroundClass === 'morning-bg' || this.currentBackgroundClass === 'day-bg') {
          return 'url("/assets/Gertma1-T.png")';
        } else if (this.currentBackgroundClass === 'evening-bg') {
          return 'url("/assets/Gertma1_evening-T.png")';
        } else {
          return 'url("/assets/Gertma1_night-T.png")';
        }
      } else {
        return 'url("/assets/Gertma2.png")';
      }
    }
  }

  private convertTimeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  loadCurrentMonthAndDayData(city?: string) {
    const selectedCity = city || this.currentCity;
    this.currentCity = selectedCity;

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

    let yearData: any[] = [];
    let data: any = null;

    if (selectedCity === 'Гертма') {
      //console.log('s sity Gertma')
      // Access JSON data - Angular wraps it in default property
      data = (gertmaData as any).default || gertmaData;
      yearData = data.year || [];
      this.currentMonthData = yearData.find((month: any) => month.mouth === currentMonthPadded);
    } else if (selectedCity === 'Махачкала') {
      // Access JSON data - Angular wraps it in default property
      data = (mkhData as any).default || mkhData;
      yearData = data.year || [];
      this.currentMonthData = yearData.find((month: any) => month.month === currentMonthPadded);

    }


    if (this.currentMonthData) {
      // Force new object reference to trigger change detection
      this.currentMonthData = {
        ...this.currentMonthData,
        days: [...this.currentMonthData.days]
      };

      const dayData = this.currentMonthData.days.find((day: any) => day.day === this.currentDayNumber);
      if (dayData) {
        this.currentDayTimestamps = [...dayData.timestamps]; // Create new array to trigger change detection
        this.updateBackgroundClass();
      } else {
        console.warn(`Day ${this.currentDayNumber} not found in month data`);
      }
    } else {
      console.warn(`Month ${currentMonthPadded} not found for city ${selectedCity}`);
    }
  }

  selectCity(city: string): void {
    this.currentCity = city;
    // Сохраняем выбранный город в localStorage
    localStorage.setItem(this.CITY_STORAGE_KEY, city);
    this.menuOpen = false;
    this.loadCurrentMonthAndDayData(city);
    // Обновляем фон после загрузки данных
    this.updateBackgroundClass();
    // Force change detection to update child components
    this.cdr.detectChanges();
  }

  openModal(): void {
    this.modalOpen = true;
    // Закрываем мобильное меню при открытии модального окна
    this.menuOpen = false;
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  openScrollWheel(): void {
    this.scrollWheelOpen = true;
    this.menuOpen = false;
  }

  closeScrollWheel(): void {
    this.scrollWheelOpen = false;
  }

  onScrollWheelSelected(index: number): void {
    this.selectedScrollIndex = index;
  }

  onScrollWheelConfirm(index: number): void {
    this.selectedScrollIndex = index;
    this.closeScrollWheel();
  }

  onItemSelected(item: string): void {
    this.selectedItem = item;
    // Close the scroll wheel modal? Or keep it open? 
    // Usually "open modal corresponding to item" might imply a drill-down.
    // Let's keep the scroll wheel open if it's a "selection", but if it's "opening a modal", maybe close scroll wheel? 
    // The user said "open modal corresponding to item", so let's stack them or close the previous one.
    // Stacking modals is sometimes tricky with z-index, but our modal system seems to support it if z-index is handled.
    // However, for simplicity and UX, let's just open the new one on top.
    this.itemDetailsModalOpen = true;
  }

  closeItemDetailsModal(): void {
    this.itemDetailsModalOpen = false;
    this.selectedItem = null;
  }

  // Cloud modal methods
  openCloudModal(): void {
    this.cloudModalOpen = true;
    this.menuOpen = false; // Close menu if open
  }

  closeCloudModal(): void {
    this.cloudModalOpen = false;
  }

  onLibrarySelected(itemTitle: string): void {
    const item = this.libraryItems.find(i => i.title === itemTitle);
    if (item) {
      this.selectedLibraryItem = item;
      this.libraryDetailModalOpen = true;
    }
  }

  closeLibraryDetailModal(): void {
    this.libraryDetailModalOpen = false;
    this.selectedLibraryItem = null;
  }
}
