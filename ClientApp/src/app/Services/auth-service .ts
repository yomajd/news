import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:4001/api/user';
  private user: User | null = null;
  private token : string | null = null;


  constructor(private http: HttpClient) {
    this.loadFromLocalStorage();
  }

  login(credentials: { email: string, password: string }): Observable<any> {
    if (this.isAuthenticated()) {
        // If already authenticated, return user info directly
        return of({ authToken: localStorage.getItem('jwtToken'), user: localStorage.getItem('user') });
      }
      
    return this.http.post<any>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.authToken && response.user) {
            this.token = response.authToken;
            this.user = response.user;
            localStorage.setItem('jwtToken', this.token!);
            localStorage.setItem('user', JSON.stringify(this.user));
          }
        }),
        catchError(error => this.handleError(error)) // Handle errors
      );
  }

  logout(): void {
    this.user = this.token = null;
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!this.user && !! this.token; 
  }

  getUser() : User | null{
    return this.user;
  }

  getUserProfile(): string {
    return this.user?.profil ?? '';
  }
  
  getToken(){
    return this.token;
  }

  getFullname(): string{
    return `${this.user?.firstName} ${this.user?.lastName}`
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(() => new Error(error.message || 'An unknown error occurred'));
  }

  private loadFromLocalStorage(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser);
      } catch (e) {
        console.error('Error parsing user from localStorage', e);
      }
    }

    this.token = localStorage.getItem('jwtToken');
  }
}
