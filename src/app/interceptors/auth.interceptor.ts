import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, from } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    // Add Authorization header if token exists and not login/public
    const token = localStorage.getItem('access_token');
    let authReq = req;
    if (token && !req.url.includes('/customer-auth/login')) {
        authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            // Check if 401 and not a refresh/login call
            if (error.status === 401 && !req.url.includes('/customer-auth/login') && !req.url.includes('/customer-auth/refresh')) {
                // Try to refresh token
                return from(authService.refreshToken()).pipe(
                    switchMap(() => {
                        // After refresh succeed, retry with new token
                        const newToken = localStorage.getItem('access_token');
                        const retryReq = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${newToken}`
                            }
                        });
                        return next(retryReq);
                    }),
                    catchError((err) => {
                        // Refresh failed, logout
                        authService.logout();
                        return throwError(() => err);
                    })
                );
            }
            return throwError(() => error);
        })
    );
};
