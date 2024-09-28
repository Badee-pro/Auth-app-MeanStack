import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  signUp(fullName: string, email: string, password: string) {
    return this.http.post(`${environment.apiBaseUrl}/signup`, {
      fullName,
      email,
      password,
    });
  }

  signIn(email: string, password: string) {
    return this.http.post(`${environment.apiBaseUrl}/signin`, {
      email,
      password,
    });
  }
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/forgot-password`, {
      email,
    });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/reset-password`, {
      token,
      newPassword,
    });
  }

  logout() {
    localStorage.removeItem('token'); // Clear the token (or any session storage)
    this.router.navigate(['/sign-in']);
  }

  getUserProfile() {
    return this.http.get(`${environment.apiBaseUrl}/profile`);
  }
}
