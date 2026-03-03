import { Component, ElementRef, ViewChild, AfterViewInit, HostListener, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-ui-scroll-wheel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-scroll-wheel.component.html',
  styleUrls: ['./ui-scroll-wheel.component.scss']
})
export class UiScrollWheelComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChild('listWheel') listWheel!: ElementRef<HTMLUListElement>;
  @Output() itemSelected = new EventEmitter<string>();

  @Input() items: string[] = Array.from({ length: 20 }, (_, i) => `List item ${i + 1}`);

  // Repeated items for infinite scroll illusion
  // We use 5 sets: [Buffer][Buffer][Active][Buffer][Buffer]
  // This ensures we have plenty of space to scroll before hitting edge and teleporting
  displayItems: string[] = [];

  private readonly SET_COUNT = 5;

  ngOnInit() {
    this.updateDisplayItems();
  }
  
  ngOnChanges() {
    this.updateDisplayItems();
  }

  private updateDisplayItems() {
    if (this.items && this.items.length > 0) {
      this.displayItems = Array(this.SET_COUNT).fill(this.items).flat();
      // Reset scroll if needed or re-calc
      setTimeout(() => {
        this.initScrollPosition();
        this.updateAnimations();
      });
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initScrollPosition();
      this.updateAnimations();
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.updateAnimations();
  }

  onScroll() {
    this.checkScrollLoop();
    this.updateAnimations();
  }

  private initScrollPosition() {
    const el = this.listWheel.nativeElement;
    const itemHeight = (el.firstElementChild as HTMLElement)?.offsetHeight || 0;
    if (!itemHeight) return;

    // Scroll to the middle of the 3rd (middle) set
    const singleSetHeight = itemHeight * this.items.length;
    // We want to be in the middle set (index 2, if 0-based)
    // Start of set 2 = singleSetHeight * 2
    el.scrollTop = singleSetHeight * Math.floor(this.SET_COUNT / 2);
  }

  private checkScrollLoop() {
    const el = this.listWheel.nativeElement;
    const itemHeight = (el.firstElementChild as HTMLElement)?.offsetHeight || 100;
    const singleSetHeight = itemHeight * this.items.length;
    const totalHeight = el.scrollHeight;
    const scrollTop = el.scrollTop;

    // If we are in the first set, jump to the middle set
    if (scrollTop < singleSetHeight) {
      el.scrollTop = scrollTop + (singleSetHeight * Math.floor(this.SET_COUNT / 2));
    }
    // If we are in the last set, jump to the middle set
    else if (scrollTop > totalHeight - singleSetHeight * 1.5) { // 1.5 ensures we are well into the last set
      // We want to go back to the equivalent position in the middle
      // Calculate offset from start of last set or similar, but simplified:
      // Current Set Index ~ scrollTop / singleSetHeight
      // We want to subtract (CurrentSetIndex - MiddleSetIndex) * singleSetHeight

      const currentSetIndex = Math.floor(scrollTop / singleSetHeight);
      const targetSetIndex = Math.floor(this.SET_COUNT / 2);
      const diff = currentSetIndex - targetSetIndex;

      if (diff !== 0) {
        el.scrollTop = scrollTop - (diff * singleSetHeight);
      }
    }
  }

  private updateAnimations() {
    const listWheelEl = this.listWheel?.nativeElement;
    if (!listWheelEl) return;

    const listRect = listWheelEl.getBoundingClientRect();
    const listCenter = listRect.top + listRect.height / 2;

    Array.from(listWheelEl.children).forEach((container: Element) => {
      const item = container.firstElementChild as HTMLElement | null;
      if (!item) return;

      const itemRect = (container as HTMLElement).getBoundingClientRect();
      const itemCenter = itemRect.top + itemRect.height / 2;

      const dist = Math.abs(listCenter - itemCenter);
      const progress = Math.min(dist / (listRect.height * 0.45), 1);

      const translateZ = -50 * progress;
      const rotateX = (itemCenter > listCenter ? -20 : 20) * progress;
      const opacity = 1 - (progress * 0.7);
      const scale = 1 - (progress * 0.2);

      item.style.opacity = opacity.toString();
      item.style.transform = `perspective(500px) translateZ(${translateZ}px) rotateX(${rotateX}deg) scale(${scale})`;
    });
  }
}
