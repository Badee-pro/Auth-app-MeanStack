import { createReducer, on } from '@ngrx/store';
import { signIn, signUp, loadUserProfile, logout } from './auth.actions';

export interface AuthState {
  user: { fullName?: string; email?: string } | null;
  loggedIn: boolean;
}

export const initialState: AuthState = {
  user: null,
  loggedIn: false,
};

export const authReducer = createReducer(
  initialState,
  on(signIn, (state, { email }) => ({
    ...state,
    loggedIn: true,
    user: { ...state.user, email },
  })),
  on(signUp, (state, { fullName, email }) => ({
    ...state,
    user: { fullName, email },
    loggedIn: true,
  })),
  on(loadUserProfile, (state, { user }) => ({ ...state, user })),
  on(logout, (state) => ({ ...state, user: null, loggedIn: false }))
);
