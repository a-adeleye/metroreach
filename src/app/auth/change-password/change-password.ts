import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-change-password',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './change-password.html',
    styleUrl: './change-password.scss'
})
export class ChangePasswordComponent implements OnInit {
    private authService = inject(AuthService);
    private router = inject(Router);

    currentPassword = '';
    newPassword = '';
    confirmPassword = '';

    isLoading = signal(false);
    error = signal('');
    success = signal(false);

    ngOnInit() {
        // Try to get current password from navigation state if redirected from login
        const state = window.history.state;
        if (state && state.currentPassword) {
            this.currentPassword = state.currentPassword;
        }
    }

    async handleChangePassword() {
        if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
            this.error.set('All fields are required.');
            return;
        }

        if (this.newPassword !== this.confirmPassword) {
            this.error.set('Passwords do not match.');
            return;
        }

        this.isLoading.set(true);
        this.error.set('');

        try {
            await this.authService.changePassword(this.currentPassword, this.newPassword);

            // Immediately refresh token as per requirements
            await this.authService.refreshToken();

            this.success.set(true);
            setTimeout(() => {
                this.router.navigate(['/dashboard']);
            }, 2000);
        } catch (e: any) {
            console.error('Password Change Error:', e);
            this.error.set(e.error?.message || 'Failed to change password. Please try again.');
        } finally {
            this.isLoading.set(false);
        }
    }
}
