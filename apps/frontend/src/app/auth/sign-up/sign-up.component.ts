import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  fullName = '';
  email = '';
  password = '';
  errorMessage = ''; // Added for error display
  successMessage = '';
  emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    // Basic validation

    if (!this.fullName || !this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }
    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long.';
      return;
    }

    const email = this.email.toLowerCase();
    this.http
      .post(`${environment.apiBaseUrl}/signup`, {
        fullName: this.fullName,
        email: this.email,
        password: this.password,
      })
      .subscribe(
        (response) => {
          this.successMessage = 'Saved successfully';
          this.errorMessage = ''; // Clear error message if any
          setTimeout(() => this.router.navigate(['/signin']), 2000); // Redirect after 2 seconds
        },
        (error) => {
          if (error.status === 400) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage =
              'Sign up failed. Please check your details and try again.';
          }
          this.successMessage = ''; // Clear success message if any
          console.error('Sign up failed', error);
        }
      );
  }
}
