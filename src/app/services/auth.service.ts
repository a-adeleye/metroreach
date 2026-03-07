import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserProfile {
    uid: string;
    email: string | null;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    mustChangePassword?: boolean;
}


export interface LoginResponse {
    accessToken?: string;
    refreshTokenId?: string;
    mustChangePassword?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private apiUrl = environment.apiUrl; // 'https://api.metroreach.ng/api'

    userProfile = signal<UserProfile | null>(null);
    isResolvingAuth = signal<boolean>(true);

    constructor() {
        this.loadStoredTokens();
    }

    private loadStoredTokens() {
        const token = localStorage.getItem('access_token');
        if (token) {
            const decoded = this.decodeToken(token);
            if (decoded) {
                this.userProfile.set({
                    uid: decoded.sub || decoded.uid,
                    email: decoded.email,
                    firstName: decoded.firstName,
                    lastName: decoded.lastName,
                    phoneNumber: decoded.phoneNumber || decoded.phone,
                    mustChangePassword: decoded.mustChangePassword === true
                });
            }
        }
        this.isResolvingAuth.set(false);
    }

    async login(username: string, pass: string): Promise<LoginResponse> {
        const response = await firstValueFrom(
            this.http.post<LoginResponse>(`${this.apiUrl}/customer-auth/login`, { username, password: pass })
        );

        if (response.accessToken) {
            this.handleAuthSuccess(response.accessToken, response.refreshTokenId || '');

            // Check if mustChangePassword is in the token or response
            const decodedToken = this.decodeToken(response.accessToken);
            if (response.mustChangePassword || decodedToken?.mustChangePassword) {
                return { ...response, mustChangePassword: true };
            }
        } else if (response.mustChangePassword) {
            return response;
        }

        return response;
    }

    async changePassword(currentPassword: string, newPassword: string): Promise<void> {
        const token = localStorage.getItem('access_token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        await firstValueFrom(
            this.http.post<{ success: boolean }>(`${this.apiUrl}/customer-auth/change-password`,
                { currentPassword, newPassword },
                { headers })
        );
    }

    async forgotPassword(email: string): Promise<void> {
        await firstValueFrom(
            this.http.post(`${this.apiUrl}/customer-auth/forgot-password`, { email })
        );
    }

    async refreshToken(): Promise<void> {
        const accessToken = localStorage.getItem('access_token');
        const refreshTokenId = localStorage.getItem('refresh_token_id');

        if (!accessToken || !refreshTokenId) {
            this.logout();
            return;
        }

        const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
        const response = await firstValueFrom(
            this.http.post<LoginResponse>(`${this.apiUrl}/customer-auth/refresh`,
                { refreshTokenId },
                { headers })
        );

        if (response.accessToken) {
            this.handleAuthSuccess(response.accessToken, response.refreshTokenId || refreshTokenId);
        }
    }

    private handleAuthSuccess(accessToken: string, refreshTokenId: string) {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token_id', refreshTokenId);

        const decoded = this.decodeToken(accessToken);
        this.userProfile.set({
            uid: decoded.sub || decoded.uid,
            email: decoded.email,
            firstName: decoded.firstName,
            lastName: decoded.lastName,
            phoneNumber: decoded.phoneNumber || decoded.phone,
            mustChangePassword: decoded.mustChangePassword === true
        });
    }

    private decodeToken(token: string): any {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) return null;
            const payload = parts[1];
            const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
            return decoded;
        } catch (e) {
            console.error('Error decoding token', e);
            return null;
        }
    }

    async logout() {
        const token = localStorage.getItem('access_token');
        if (token) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
            try {
                await firstValueFrom(this.http.post(`${this.apiUrl}/customer-auth/logout`, {}, { headers }));
            } catch (e) {
                console.error('Logout API failed', e);
            }
        }
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token_id');
        this.userProfile.set(null);
        this.router.navigate(['/login']);
    }

    async updateProfile(data: Partial<UserProfile>) {
        const token = localStorage.getItem('access_token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        await firstValueFrom(
            this.http.post<UserProfile>(`${this.apiUrl}/customer-auth/update-profile`, data, { headers })
        );

        // Update local signal for UI consistency
        this.userProfile.update(prev => prev ? { ...prev, ...data } : null);
    }

    isAuthenticated(): boolean {
        return !!this.userProfile();
    }
}


