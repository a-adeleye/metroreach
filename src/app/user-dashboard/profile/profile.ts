import { Component, inject, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, FormsModule, ConfirmationDialogComponent],
    templateUrl: './profile.html',
    styleUrl: './profile.scss'
})
export class ProfileComponent {
    private authService = inject(AuthService);

    profile = this.authService.userProfile;
    isLoading = signal(false);
    message = signal({ text: '', type: '' });

    // Profile fields
    firstName = signal('');
    lastName = signal('');
    phoneNumber = signal('');

    // Password fields
    currentPassword = '';
    newPassword = '';
    confirmPassword = '';

    // Computed properties for validation and change detection
    profileChanges = computed(() => {
        const p = this.profile();
        if (!p) return null;

        const changes: any = {};
        if (this.firstName() !== (p.firstName || '')) changes.firstName = this.firstName();
        if (this.lastName() !== (p.lastName || '')) changes.lastName = this.lastName();
        if (this.phoneNumber() !== (p.phoneNumber || '')) changes.phoneNumber = this.phoneNumber();

        return Object.keys(changes).length > 0 ? changes : null;
    });

    canUpdateProfile = computed(() => this.profileChanges() !== null && !this.isLoading());

    canChangePassword = computed(() => {
        return this.currentPassword.length > 0 &&
            this.newPassword.length > 0 &&
            this.confirmPassword.length > 0 &&
            !this.isLoading();
    });

    // Dialog state
    showConfirmDialog = signal(false);
    dialogConfig = signal({
        title: '',
        message: '',
        confirmText: '',
        action: () => { }
    });

    constructor() {
        effect(() => {
            const p = this.profile();
            if (p) {
                // Only set if they are currently empty to avoid overwriting user input
                if (!this.firstName()) this.firstName.set(p.firstName || '');
                if (!this.lastName()) this.lastName.set(p.lastName || '');
                if (!this.phoneNumber()) this.phoneNumber.set(p.phoneNumber || '');
            }
        });
    }

    async updateProfile() {
        const changes = this.profileChanges();
        if (!changes) return;

        this.dialogConfig.set({
            title: 'Update Profile',
            message: 'Are you sure you want to update your profile information?',
            confirmText: 'Update',
            action: () => this.executeProfileUpdate(changes)
        });
        this.showConfirmDialog.set(true);
    }

    private async executeProfileUpdate(changes: any) {
        this.showConfirmDialog.set(false);
        this.isLoading.set(true);
        this.message.set({ text: '', type: '' });
        try {
            await this.authService.updateProfile(changes);
            this.message.set({ text: 'Profile updated successfully!', type: 'success' });
            this.showConfirmDialog.set(false);
        } catch (e: any) {
            this.message.set({ text: e.message || 'Failed to update profile', type: 'error' });
            this.showConfirmDialog.set(false);
        } finally {
            this.isLoading.set(false);
        }
    }

    async changePassword() {
        if (this.newPassword !== this.confirmPassword) {
            this.message.set({ text: 'Passwords do not match', type: 'error' });
            return;
        }

        this.dialogConfig.set({
            title: 'Change Password',
            message: 'Are you sure you want to change your account password?',
            confirmText: 'Change',
            action: () => this.executePasswordChange()
        });
        this.showConfirmDialog.set(true);
    }

    private async executePasswordChange() {
        this.isLoading.set(true);
        this.message.set({ text: '', type: '' });
        try {
            await this.authService.changePassword(this.currentPassword, this.newPassword);
            this.message.set({ text: 'Password changed successfully!', type: 'success' });
            this.currentPassword = '';
            this.newPassword = '';
            this.confirmPassword = '';
            this.showConfirmDialog.set(false);
        } catch (e: any) {
            console.error(e);
            this.message.set({ text: 'Failed to change password. Check your current password.', type: 'error' });
            this.showConfirmDialog.set(false);
        } finally {
            this.isLoading.set(false);
        }
    }
}
