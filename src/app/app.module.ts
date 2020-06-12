import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID, APP_INITIALIZER } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeHe from '@angular/common/locales/he';
import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { InvitationModule } from './invitation/invitation.module';
import { AppRoutingModule } from './app-routing.module';
import { InvitationService } from './services/invitation.service';
import { AuthService } from './services/auth.service';
import { AppLoadService } from './services/app-load.service';
import { SignLayoutModule } from './components/sign-layout/sign-layout.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

registerLocaleData(localeHe);

export function initApp(appLoadService: AppLoadService) {
  return () => appLoadService.initializeApp();
}

@NgModule({
  declarations: [AppComponent, PageNotFoundComponent],
  imports: [
    BrowserModule,
    NgbModule,
    HttpClientModule,
    AppRoutingModule,
    InvitationModule,
    SignLayoutModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'he-IL' },
    InvitationService,
    AppLoadService,
    AuthService,
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [AppLoadService, AuthService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
