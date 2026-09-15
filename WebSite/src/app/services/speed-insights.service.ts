import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { injectSpeedInsights } from '@vercel/speed-insights';

/**
 * Service to initialize and manage Vercel Speed Insights for Angular.
 * This service automatically tracks page views and performance metrics.
 */
@Injectable({
  providedIn: 'root'
})
export class SpeedInsightsService {
  private router = inject(Router);
  private speedInsights: ReturnType<typeof injectSpeedInsights> | null = null;

  /**
   * Initializes Vercel Speed Insights and sets up route tracking.
   * Should be called once during application initialization.
   */
  initialize(): void {
    // Inject the Speed Insights script
    this.speedInsights = injectSpeedInsights({
      framework: 'angular',
      debug: false
    });

    // Track route changes
    if (this.speedInsights) {
      this.router.events
        .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          // Update the route for Speed Insights
          this.speedInsights?.setRoute(event.urlAfterRedirects);
        });
    }
  }
}
