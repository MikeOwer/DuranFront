/* import { Injectable } from "@angular/core";
import PocketBase from 'pocketbase';
import { environment } from "../../../environments/environment.prod";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private pb!: PocketBase;

  constructor() {
    this.pb = new PocketBase(environment.APIEndpoint);
  }

  async login(email: string, password: string) {
    try {
      const authData = await this.pb.collection('usuarios').authWithPassword(email, password);
      return authData;
    } catch (error) {
      throw error;
    }
  }

  logout() {
    this.pb.authStore.clear();
  }

  isAuthenticated(): boolean {
    return this.pb.authStore.isValid;
  }

  getUser() {
    return this.pb.authStore.model;
  }

} */

import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from "../../../environments/environment";
import { Observable, tap } from 'rxjs';

interface AuthResponse {
  auth: {
    access_token: string;
    token_type: 'Bearer';
  };
  user?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiURL = environment.APIEndpoint;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(email_usuario: string, password: string): Observable<AuthResponse> {
    console.log('URL:', `${this.apiURL}/login/`);
    return this.http.post<AuthResponse>(`${this.apiURL}/login/`, { email_usuario, password }).pipe(
      tap(response => {
        console.log('Login response:', response);
        this.setToken(response.auth.access_token);
        if (response.user) {
          this.setUser(response.user);
        }
      })
    );
  }

  login2(email_usuario: string, password: string): Observable<any> {
    return this.http.post(`${this.apiURL}/login/`, { email_usuario, password })
  }

  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean { //Falta checar
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): any {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private setUser(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  getProfile(): Observable<any> {
    const token = this.getToken();

    const headers = {
      Authorization: `Bearer ${token}`
    };

    return this.http.get(`${this.apiURL}/me`,{ headers }).pipe(
      tap(user => this.setUser(user))
    );
  }

  hasPermission(permission: string): boolean {
    const user = this.getUser();
    return user?.permissions?.includes(permission);
  }

  hasRole(role: string): boolean {
    const user = this.getUser();
    return user?.roles?.includes(role);
  }
}