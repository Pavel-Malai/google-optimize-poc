import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'google-optimize-poc';
  private trackingId: string = 'OPT-KQRV7XJ';
  private googleAnalyticsTrackingId: string = 'G-KP7V7N306D';

  culturesFormControl = new FormControl();

  cultures: Culture[] = [
    { value: 'en-GB', name: 'English' },
    { value: 'de-DE', name: 'German' }
  ];

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private cookieService: CookieService
  ) {
  }

  ngOnInit(): void {
    this.culturesFormControl.valueChanges.subscribe(s => {
      this.setCultureCookie(s);
      console.log(`The selected value is ${s}`);
    });

    this.setCultureCookie('en-GB');

    this.addGoogleOptimize(this.trackingId);
    this.addGoogleAnalytics(this.googleAnalyticsTrackingId);
  }

  setCultureCookie(value: string) {
    this.cookieService.set('_culture', value, undefined, undefined, '.2.azurestaticapps.net')
    this.cookieService.set('_culture', value, undefined, undefined, 'localhost')
  }

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

interface Culture {
  value: string;
  name: string;
}
