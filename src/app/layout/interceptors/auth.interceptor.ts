import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpInterceptorFn 
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('auth_token');

  console.log('Interceptor ejecutado para:', req.url); // Debug

  const authReq = req.clone({
    setHeaders: {
      Accept: 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Error HTTP:', error);
      if (error.status === 401 || error.status === 419) {
        localStorage.clear();
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
};