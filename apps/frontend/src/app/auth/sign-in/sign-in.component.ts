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
  emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    const email = this.email.toLowerCase();

    const userCredentials = {
      email: this.email,
      password: this.password,
    };

    this.http
      .post(`${environment.apiBaseUrl}/signin`, userCredentials)
      .subscribe(
        (response: any) => {
          localStorage.setItem('token', response.accessToken); // Save the token in local storage
          this.router.navigate(['/profile']); // Navigate to the user-profile
        },
        (error) => {
          if (error.status === 404) {
            this.errorMessage = 'Email is not registered.';
          } else if (error.status === 401) {
            this.errorMessage = 'Wrong password entered.';
          } else {
            this.errorMessage = 'Authentication failed. Please try again.';
          }
          console.error('Sign-in failed', error);
        }
      );
  }
}
