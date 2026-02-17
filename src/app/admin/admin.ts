import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkActive],
    templateUrl: './admin.html',
    styleUrl: './admin.scss'
})
export class AdminComponent {
    authService = inject(AuthService);

    menuItems = [
        { label: 'Dashboard', icon: 'grid', route: '/admin/dashboard' },
        { label: 'Leads', icon: 'users', route: '/admin/leads' },
        { label: 'Infrastructure', icon: 'database', route: '/admin/infrastructure' },
        { label: 'Settings', icon: 'settings', route: '/admin/settings' }
    ];

    handleLogout() {
        this.authService.logout();
    }
}
