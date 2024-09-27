import { createAction, props } from '@ngrx/store';

export const signUp = createAction(
  '[Auth] Sign Up',
  props<{ fullName: string; email: string; password: string }>()
);

export const signIn = createAction(
  '[Auth] Sign In',
  props<{ email: string; password: string }>()
);

export const loadUserProfile = createAction(
  '[Auth] Load User Profile',
  props<{ user: { fullName: string; email: string } }>() // Ensure user payload has correct type
);

export const logout = createAction('[Auth] Logout');
