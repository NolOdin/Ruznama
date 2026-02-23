import { Component, Input, Output, EventEmitter, HostListener, HostBinding, OnChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-modal.component.html',
  styleUrls: ['./ui-modal.component.scss']
})
export class UiModalComponent implements OnChanges, OnDestroy {
  @Input() isOpen = false;
  @Input() title: string = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() closeOnBackdropClick = true;
  @Input() closeOnEscape = true;
  @Input() scrollable = true;

  @Output() close = new EventEmitter<void>();
  @Output() opened = new EventEmitter<void>();

  @HostBinding('class.ui-modal-overlay')
  get overlayClass() {
    return true;
  }

  @HostBinding('class.ui-modal-open')
  get isOpenClass() {
    return this.isOpen;
  }

  @HostListener('window:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    if (this.isOpen && this.closeOnEscape) {
      this.closeModal();
    }
  }

  ngOnChanges(): void {
    if (this.isOpen) {
      // Блокируем скролл body при открытии модального окна
      document.body.style.overflow = 'hidden';
      this.opened.emit();
    } else {
      // Восстанавливаем скролл
      document.body.style.overflow = '';
    }
  }

  closeModal(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    // Закрываем только если клик был именно на backdrop, а не на содержимое модального окна
    if (this.closeOnBackdropClick && event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  ngOnDestroy(): void {
    // Восстанавливаем скролл при уничтожении компонента
    document.body.style.overflow = '';
  }
}

