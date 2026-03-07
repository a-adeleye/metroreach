import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './forgot-password.html',
    styleUrl: './forgot-password.scss'
})
export class ForgotPasswordComponent {
    private router = inject(Router);
    private authService = inject(AuthService);

    email = '';
    isLoading = signal(false);
    isSubmitted = signal(false);
    error = signal('');

    async handleReset() {
        if (!this.email) {
            this.error.set('Please enter your email.');
            return;
        }

        this.isLoading.set(true);
        this.error.set('');

        try {
            await this.authService.forgotPassword(this.email);
            this.isSubmitted.set(true);
        } catch (e: any) {
            console.error('Reset Error:', e);
            this.error.set(e.error?.message || 'Failed to send reset email. Please try again.');
        } finally {
            this.isLoading.set(false);
        }
    }


    backToLogin() {
        this.router.navigate(['/login']);
    }
}
