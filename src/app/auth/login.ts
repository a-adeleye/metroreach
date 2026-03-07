import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './login.html',
    styleUrl: './login.scss'
})
export class LoginComponent implements OnInit {
    protected authService = inject(AuthService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    email = '';
    password = '';
    rememberMe = false;
    isPasswordless = false;

    isLoading = signal(false);
    linkSent = signal(false);
    error = signal('');

    get maskedEmail() {
        if (!this.email) return '';
        const [user, domain] = this.email.split('@');
        if (!domain) return this.email;
        const visible = Math.min(2, Math.floor(user.length / 2));
        return user.substring(0, visible) + '***' + '@' + domain;
    }

    async ngOnInit() {
        // Load saved email if 'Remember Me' was used
        const savedEmail = localStorage.getItem('remember_email');
        if (savedEmail) {
            this.email = savedEmail;
            this.rememberMe = true;
        }

        if (this.authService.isAuthenticated()) {
            this.redirect();
        }
    }

    async handleLogin() {
        if (!this.email) {
            this.error.set('Please enter your email.');
            return;
        }

        this.isLoading.set(true);
        this.error.set('');

        try {
            const response = await this.authService.login(this.email, this.password);

            if (response.mustChangePassword) {
                this.router.navigate(['/change-password'], { state: { currentPassword: this.password } });
                return;
            }

            // Handle Remember Me
            if (this.rememberMe) {
                localStorage.setItem('remember_email', this.email);
            } else {
                localStorage.removeItem('remember_email');
            }

            this.redirect();
        } catch (e: any) {
            console.error('Login Error:', e);
            this.error.set(this.getFriendlyError(e.status));
        } finally {
            this.isLoading.set(false);
        }
    }

    navigateToForgot() {
        this.router.navigate(['/forgot-password']);
    }

    private redirect() {
        const profile = this.authService.userProfile();
        if (profile?.mustChangePassword) {
            this.router.navigate(['/change-password']);
            return;
        }
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigateByUrl(returnUrl);
    }


    private getFriendlyError(status?: number): string {
        if (!status) return 'An unexpected error occurred. Please try again.';
        switch (status) {
            case 401: return 'Invalid email or password.';
            case 403: return 'Account is disabled.';
            case 404: return 'Login service not found.';
            default: return `Error: ${status}. Please contact support.`;
        }
    }
}
