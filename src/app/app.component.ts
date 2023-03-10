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
  territoriesFormControl = new FormControl();

  cultures: Culture[] = [
    { value: 'en-GB', name: 'English' },
    { value: 'de-DE', name: 'German' },
    { value: 'es-ES', name: 'Spanish' }
  ];

  territories: Territory[] = [
    { value: 'gb', name: 'Great Britain' },
    { value: 'germany', name: 'Germany' },
    { value: 'spain', name: 'Spain' }
  ];

  customer_territory: string = '';

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

    this.territoriesFormControl.valueChanges.subscribe(s => {
      this.customer_territory = s;
      window.customer_territory = s;
    });

    let currentCulture = this.cookieService.get('_culture')
    if (!currentCulture) {
      this.setCultureCookie(this.cultures[0].value);
      this.culturesFormControl.setValue(this.cultures[0].value);
    } else {
      this.culturesFormControl.setValue(currentCulture);
    }

    if (!this.customer_territory) {
      this.customer_territory = this.territories[0].value;
      this.territoriesFormControl.setValue(this.territories[0].value);
    }

    this.addGoogleOptimize(this.trackingId);
    this.addGoogleAnalytics(this.googleAnalyticsTrackingId);
  }

  setCultureCookie(value: string) {


    //this.cookieService.set('_culture', value, expiration.getTime(), '/', '.2.azurestaticapps.net', true, )
    this.cookieService.set('_culture', value, 31536000, '/', '.witty-forest-0b0445210.2.azurestaticapps.net', true)
    this.cookieService.set('_culture', value, 31536000, '/', 'localhost')
  }

  private createCustomerTerritoryGlobalVariable(teritory: string): HTMLScriptElement {
    const cultureVariable: HTMLScriptElement = this.doc.createElement('script');
    cultureVariable.type = 'text/javascript';

    cultureVariable.text = `
        var customer_territory = \'${teritory}\';
    `;

    return cultureVariable;
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
            function gtag(){dataLayer.push(arguments);
            }
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

      this.doc.head.appendChild(this.createCustomerTerritoryGlobalVariable(this.customer_territory));
      this.doc.head.appendChild(gOptimizeConnect);
    }
  }
}

interface Culture {
  value: string;
  name: string;
}

interface Territory {
  value: string;
  name: string;
}

declare global {
  interface Window { customer_territory: string; }
}
