import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth-service ';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-news-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './news-login.component.html',
  styleUrl: './news-login.component.css'
})
export class NewsLoginComponent implements OnInit{

  email = '';
  password = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  login(): void {
    this.authService.login({ email: this.email, password: this.password })
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: () => this.errorMessage = 'Email ou mot de passe invalide. Veuillez réessayer.'
      });
  }
}
