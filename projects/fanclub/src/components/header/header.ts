import {afterNextRender, Component, DestroyRef, inject, PLATFORM_ID, signal} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {filter, fromEvent, map, pairwise, throttleTime} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'fanclub-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  isHidden = signal(false);
  isMobileMenuOpen = signal(false);
  private platformId = inject(PLATFORM_ID);
  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;

      // Scroll hide/show functionality
      fromEvent(window, 'scroll')
        .pipe(
          throttleTime(50),
          map(() => Math.max(window.scrollY || 0, 0)),
          pairwise(),
          filter(([p, c]) => Math.abs(c - p) > 5),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(([prev, curr]) => {
          this.isHidden.set(curr > prev && curr > 80);
        });

      // Close mobile menu on window resize (if it becomes desktop size)
      fromEvent(window, 'resize')
        .pipe(
          throttleTime(100),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(() => {
          if (window.innerWidth >= 1024 && this.isMobileMenuOpen()) {
            this.closeMobileMenu();
          }
        });

      // Close mobile menu on escape key
      fromEvent<KeyboardEvent>(document, 'keydown')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((event) => {
          if (event.key === 'Escape' && this.isMobileMenuOpen()) {
            this.closeMobileMenu();
          }
        });
    });
  }

  toggleDarkMode(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.classList.toggle('dark');
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(value => !value);
    // Prevent body scroll when menu is open
    if (isPlatformBrowser(this.platformId)) {
      if (this.isMobileMenuOpen()) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }
}
