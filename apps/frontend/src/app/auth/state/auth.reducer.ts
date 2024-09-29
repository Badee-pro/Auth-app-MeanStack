import { createReducer, on } from '@ngrx/store';
import { signInSuccess, signInFailure } from './auth.actions';

export interface AuthState {
  user: any | null;
  error: any | null;
}

export const initialState: AuthState = {
  user: null,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(signInSuccess, (state, { user }) => ({
    ...state,
    user,
    error: null,
  })),
  on(signInFailure, (state, { error }) => ({
    ...state,
    user: null,
    error,
  }))
);
