import { Component, inject, signal, OnInit, computed } from '@angular/core';
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
        { label: 'Dashboard', icon: 'grid', route: '/dashboard/overview' },
        { label: 'Payment History', icon: 'credit-card', route: '/dashboard/billing' },
        { label: 'My Devices', icon: 'package', route: '/dashboard/plan' },
        { label: 'Account Settings', icon: 'user', route: '/dashboard/profile' },
        { label: 'Support Tickets', icon: 'help-circle', route: '/dashboard/support' }
    ];

    pageTitle = computed(() => {
        const url = this.router.url;
        const item = this.menuItems.find(i => url.includes(i.route));
        return item ? item.label : 'Dashboard';
    });

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
