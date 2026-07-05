import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PwaService } from '../../services/pwa.service';
import { UiButtonComponent } from '../button/ui-button.component';
import { UiModalComponent } from '../modal/ui-modal.component';

@Component({
  selector: 'app-pwa-install',
  standalone: true,
  imports: [CommonModule, UiButtonComponent, UiModalComponent],
  templateUrl: './pwa-install.component.html',
  styleUrls: ['./pwa-install.component.scss']
})
export class PwaInstallComponent implements OnInit {
  canInstall = false;
  showIosInstructions = false;
  showAndroidInstructions = false;

  @Output() modalStateChanged = new EventEmitter<boolean>();

  constructor(private pwaService: PwaService) {}

  ngOnInit() {
    this.pwaService.canInstall$.subscribe(can => {
      this.canInstall = can;
    });
  }

  install() {
    const action = this.pwaService.installPwa();
    if (action === 'ios-instructions') {
      this.showIosInstructions = true;
      this.modalStateChanged.emit(true);
    } else if (action === 'android-instructions') {
      this.showAndroidInstructions = true;
      this.modalStateChanged.emit(true);
    }
  }

  closeIosInstructions() {
    this.showIosInstructions = false;
    this.modalStateChanged.emit(false);
  }

  closeAndroidInstructions() {
    this.showAndroidInstructions = false;
    this.modalStateChanged.emit(false);
  }
}
