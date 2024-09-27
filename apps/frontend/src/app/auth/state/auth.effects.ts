import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { signIn, signUp, loadUserProfile } from './auth.actions';
import { map, mergeMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private authService: AuthService) {}

  signUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signUp),
      mergeMap((action) =>
        this.authService
          .signUp(action.fullName, action.email, action.password)
          .pipe(
            map((response: any) =>
              loadUserProfile({
                user: { fullName: response.fullName, email: response.email },
              })
            )
          )
      )
    )
  );

  signIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signIn),
      mergeMap((action) =>
        this.authService.signIn(action.email, action.password).pipe(
          map((response: any) =>
            loadUserProfile({
              user: { fullName: response.fullName, email: response.email },
            })
          )
        )
      )
    )
  );
}
