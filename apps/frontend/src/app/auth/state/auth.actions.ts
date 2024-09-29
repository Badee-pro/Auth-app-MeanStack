import { createAction, props } from '@ngrx/store';

export const signIn = createAction(
  '[Auth] Sign In',
  props<{ email: string; password: string }>()
);

export const signInSuccess = createAction(
  '[Auth] Sign In Success',
  props<{ user: any }>()
);

export const signInFailure = createAction(
  '[Auth] Sign In Failure',
  props<{ error: any }>()
);
