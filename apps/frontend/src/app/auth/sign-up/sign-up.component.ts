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
  errorMessage = '';
  successMessage = '';
  emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    if (!this.fullName || !this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }
    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long.';
      return;
    }

    const userData = {
      fullName: this.fullName,
      email: this.email.toLowerCase(),
      password: this.password,
    };

    this.http.post(`${environment.apiBaseUrl}/signup`, userData).subscribe(
      (response) => {
        this.successMessage = 'Registration successful!';
        this.errorMessage = '';
        setTimeout(() => this.router.navigate(['/signin']), 1000);
      },
      (error) => {
        if (error.status === 400) {
          this.errorMessage =
            error.error.message || 'An error occurred. Please try again.';
        } else {
          this.errorMessage =
            'Sign up failed. Please check your details and try again.';
        }
        this.successMessage = '';
        console.error('Sign up failed', error);
      }
    );
  }
}
