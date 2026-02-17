import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-user-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkActive],
    templateUrl: './user-dashboard.html',
    styleUrl: './user-dashboard.scss'
})
export class UserDashboardComponent implements OnInit {
    protected authService = inject(AuthService);
    private router = inject(Router);

    isSidebarOpen = signal(false);

    menuItems = [
        { label: 'Overview', icon: 'grid', route: '/dashboard/overview' },
        { label: 'Profile', icon: 'user', route: '/dashboard/profile' },
        { label: 'My Plan', icon: 'package', route: '/dashboard/plan' },
        { label: 'Billing', icon: 'credit-card', route: '/dashboard/billing' },
        { label: 'Support', icon: 'help-circle', route: '/dashboard/support' }
    ];

    toggleSidebar() {
        this.isSidebarOpen.update(v => !v);
    }

    ngOnInit() {
        // Initial checks
    }

    async logout() {
        await this.authService.logout();
        this.router.navigate(['/login']);
    }
}
