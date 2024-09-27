import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  HttpClientModule,
  provideHttpClient,
  HttpClient,
  withFetch,
} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './auth/state/auth.effects';
import { authReducer } from './auth/state/auth.reducer';
import { AuthService } from './auth/state/auth.service';

@NgModule({
  declarations: [
    // AppComponent,
    // SignInComponent,
    // SignUpComponent,
    // UserProfileComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    StoreModule.forRoot({ auth: authReducer }),
    EffectsModule.forRoot([AuthEffects]),
  ],
  providers: [
    HttpClientModule,
    HttpClient,
    AuthService,
    provideHttpClient(withFetch()),
  ],
  // bootstrap: [AppComponent],
})
export class AppModule {}
