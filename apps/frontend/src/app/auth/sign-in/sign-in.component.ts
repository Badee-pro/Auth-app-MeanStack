import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent {
  email = '';
  password = '';
  errorMessage = '';
  emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    const userCredentials = {
      email: this.email.toLowerCase(),
      password: this.password,
    };

    this.http
      .post(`${environment.apiBaseUrl}/signin`, userCredentials)
      .subscribe(
        (response: any) => {
          localStorage.setItem('token', response.accessToken);
          this.router.navigate(['/profile']);
        },
        (error) => {
          if (error.status === 400) {
            if (error.error.message.includes('not registered')) {
              this.errorMessage =
                'This email is not registered. Please sign up.';
            } else {
              this.errorMessage = 'Invalid credentials. Please try again.';
            }
          } else if (error.status === 401) {
            if (error.error.message === 'You have to contact support.') {
              this.errorMessage = 'You have to contact support.';
            } else {
              this.errorMessage = 'Invalid password. Please try again.';
            }
          } else {
            this.errorMessage =
              'Authentication failed. Please try again later.';
          }
          console.error('Sign-in failed', error);
        }
      );
  }
}
