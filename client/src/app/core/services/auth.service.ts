import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:5000/api/auth';
  
  currentUser = signal<any>(this.getUserFromStorage());

  register(userData: any) {
    return this.http.post<any>(this.apiUrl + '/register', userData)
      .pipe(tap(response => this.handleAuthSuccess(response)));
  }

  login(credentials: any) {
    return this.http.post<any>(this.apiUrl + '/login', credentials)
      .pipe(tap(response => this.handleAuthSuccess(response)));
  }

  logout() {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    const data = this.currentUser();
    return data && data.user && data.user.role === 'admin';
  }

  getToken() {
    return localStorage.getItem('user_token');
  }

  private handleAuthSuccess(response: any) {
    localStorage.setItem('user_token', response.token);
    localStorage.setItem('user_data', JSON.stringify(response));
    this.currentUser.set(response);
  }

  private getUserFromStorage() {
    const user = localStorage.getItem('user_data');
    return user ? JSON.parse(user) : null;
  }
}
