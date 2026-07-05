import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private promptEvent: any;
  private canInstallSubject = new BehaviorSubject<boolean>(false);
  canInstall$ = this.canInstallSubject.asObservable();
  
  isIos = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.init();
    }
  }

  private init() {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    this.isIos = /iphone|ipad|ipod/.test(userAgent);

    // Detect if already installed (standalone)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;

    if (isStandalone) {
      this.canInstallSubject.next(false);
      return;
    }

    // Always show the install button if not standalone.
    // We will show instructions if the native prompt is not available.
    this.canInstallSubject.next(true);

    if (!this.isIos) {
      // Listen for Android/Chrome prompt
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        this.promptEvent = e;
      });

      window.addEventListener('appinstalled', () => {
        this.canInstallSubject.next(false);
      });
    }
  }

  installPwa(): 'prompt' | 'ios-instructions' | 'android-instructions' | null {
    if (this.isIos) {
      return 'ios-instructions';
    }
    
    if (this.promptEvent) {
      this.promptEvent.prompt();
      this.promptEvent.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
          this.canInstallSubject.next(false);
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        this.promptEvent = null;
      });
      return 'prompt';
    }

    // If no prompt event (e.g. running locally via ng serve, or desktop browser where it doesn't fire)
    return 'android-instructions';
  }
}
