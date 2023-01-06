import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private trackingId: string = 'OPT-KQRV7XJ';
  private googleAnalyticsTrackingId: string = 'G-KP7V7N306D';
  constructor(
    @Inject(DOCUMENT) private doc: Document
  ) {
  }

  ngOnInit(): void {
    this.addGoogleOptimize(this.trackingId);
    this.addGoogleAnalytics(this.googleAnalyticsTrackingId);
  }

  title = 'google-optimize-poc';

  private addGoogleAnalytics(trackingId: string): void {
    if (trackingId) {
      const gtagConnect: HTMLScriptElement =
        this.doc.createElement('script');
      gtagConnect.async = true;
      gtagConnect.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;

      const runGoogleAnalytics: HTMLScriptElement =
        this.doc.createElement('script');
      runGoogleAnalytics.type = 'text/javascript';
      runGoogleAnalytics.text = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
        `;

      this.doc.head.appendChild(gtagConnect);
      this.doc.head.appendChild(runGoogleAnalytics);
    }
  }

  private addGoogleOptimize(trackingId: string): void {
    if (trackingId) {
        const gOptimizeConnect: HTMLScriptElement =
            this.doc.createElement('script');
        gOptimizeConnect.src = `https://www.googleoptimize.com/optimize.js?id=${trackingId}`;

        this.doc.head.appendChild(gOptimizeConnect);
    }
}
}
