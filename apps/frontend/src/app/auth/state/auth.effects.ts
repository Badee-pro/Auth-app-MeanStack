import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
// import { AuthService } from '../services/auth.service';
import { signIn, signInSuccess, signInFailure } from './auth.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService
  ) {}

  signIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signIn),
      mergeMap(({ email, password }) =>
        this.authService.login({ email, password }).pipe(
          map((user) => signInSuccess({ user })),
          catchError((error) => of(signInFailure({ error })))
        )
      )
    )
  );
}
