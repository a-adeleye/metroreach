import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, TitleCasePipe],
    templateUrl: './login.html',
    styleUrl: './login.scss'
})
export class LoginComponent implements OnInit {
    protected authService = inject(AuthService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    email = '';
    password = '';
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
        await this.authService.completePasswordlessSignIn();
        if (this.authService.userProfile()) {
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
            if (this.isPasswordless) {
                await this.authService.sendPasswordlessLink(this.email);
                this.linkSent.set(true);
            } else {
                await this.authService.login(this.email, this.password);
                this.redirect();
            }
        } catch (e: any) {
            console.error('Login Error:', e);
            this.error.set(this.getFriendlyError(e.code));
        } finally {
            this.isLoading.set(false);
        }
    }

    toggleMode() {
        this.isPasswordless = !this.isPasswordless;
        this.error.set('');
    }

    private redirect() {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigateByUrl(returnUrl);
    }

    private getFriendlyError(code?: string): string {
        if (!code) return 'An unexpected error occurred. Please try again.';
        switch (code) {
            case 'auth/user-not-found': return 'Account not found.';
            case 'auth/wrong-password': return 'Invalid credentials.';
            case 'auth/invalid-email': return 'Please enter a valid email.';
            case 'auth/invalid-login-credentials': return 'Invalid email or password.';
            case 'auth/configuration-not-found': return 'Passwordless login is not enabled in Firebase Console.';
            default: return `Error: ${code}. Please contact support.`;
        }
    }
}
