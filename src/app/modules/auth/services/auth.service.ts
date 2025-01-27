import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8085/api/v1/auth';
  private jwtTokenKey = 'authToken';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = this.getToken();
    if (token) {
      this.decodeAndSetUser(token);
    }
  }

  register(user: any): Subscription {
    return this.http.post(`${this.API_URL}/register`, user).subscribe(() => {
      return true;
    });
  }

  login(loginRequest: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, loginRequest).pipe(
      tap((response: any) => {
        const token = response.token;
        if (token) {
          this.storeToken(token);
          this.decodeAndSetUser(token);
        }
      })
    );
  }

  logout(): void {
    this.http.post(`${this.API_URL}/logout`, {}).subscribe(() => {
      this.clearToken();
      this.currentUserSubject.next(null);
    });
  }

  getToken(): string | null {
    return localStorage.getItem(this.jwtTokenKey);
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.jwtTokenKey, token);
  }

  private clearToken(): void {
    localStorage.removeItem(this.jwtTokenKey);
  }

  private decodeAndSetUser(token: string): void {
    const payload = JSON.parse(atob(token.split('.')[1]));
    this.currentUserSubject.next(payload);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
