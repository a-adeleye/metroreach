import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './profile.html',
    styleUrl: './profile.scss'
})
export class ProfileComponent {
    private authService = inject(AuthService);

    profile = this.authService.userProfile;
    isLoading = signal(false);
    message = signal({ text: '', type: '' });

    // Profile fields
    fullName = signal('');
    phone = signal('');

    // Password fields
    currentPassword = '';
    newPassword = '';
    confirmPassword = '';

    constructor() {
        // Initialize fields from profile
        const p = this.profile();
        if (p) {
            this.fullName.set(p.fullName || '');
            this.phone.set(p.phone || '');
        }
    }

    async updateProfile() {
        this.isLoading.set(true);
        this.message.set({ text: '', type: '' });
        try {
            await this.authService.updateProfile({
                fullName: this.fullName(),
                phone: this.phone()
            });
            this.message.set({ text: 'Profile updated successfully!', type: 'success' });
        } catch (e: any) {
            this.message.set({ text: e.message || 'Failed to update profile', type: 'error' });
        } finally {
            this.isLoading.set(false);
        }
    }

    async changePassword() {
        if (this.newPassword !== this.confirmPassword) {
            this.message.set({ text: 'Passwords do not match', type: 'error' });
            return;
        }

        this.isLoading.set(true);
        this.message.set({ text: '', type: '' });
        try {
            await this.authService.changePassword(this.currentPassword, this.newPassword);
            this.message.set({ text: 'Password changed successfully!', type: 'success' });
            this.currentPassword = '';
            this.newPassword = '';
            this.confirmPassword = '';
        } catch (e: any) {
            console.error(e);
            this.message.set({ text: 'Failed to change password. Check your current password.', type: 'error' });
        } finally {
            this.isLoading.set(false);
        }
    }
}
