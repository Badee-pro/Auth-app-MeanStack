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

    const userCredentials = {
      email: this.email.toLowerCase(), // Convert email to lowercase
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
          // Check for the specific error message from the backend
          if (
            error.status === 400 &&
            error.error.message.includes('not registered')
          ) {
            this.errorMessage = 'This email is not registered. Please sign up.';
          } else if (error.status === 401) {
            this.errorMessage = 'Invalid password. Please try again.'; // Error for incorrect password
          } else {
            this.errorMessage =
              'Authentication failed. Please try again later.'; // Fallback message
          }
          console.error('Sign-in failed', error);
        }
      );
  }
}
