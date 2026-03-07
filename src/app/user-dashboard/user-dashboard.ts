import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-user-dashboard',
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
        { label: 'Account Settings', icon: 'user', route: '/dashboard/profile' },
        { label: 'Support Tickets', icon: 'help-circle', route: '/dashboard/support' }
    ];

    userFullName = computed(() => {
        const p = this.authService.userProfile();
        if (!p) return 'User';
        if (p.firstName && p.lastName) return `${p.firstName} ${p.lastName}`;
        return p.firstName || p.lastName || p.email || 'User';
    });

    userInitials = computed(() => {
        const p = this.authService.userProfile();
        if (!p) return 'U';
        if (p.firstName && p.lastName) {
            return (p.firstName[0] + p.lastName[0]).toUpperCase();
        }
        return (p.firstName?.[0] || p.lastName?.[0] || p.email?.[0] || 'U').toUpperCase();
    });

    userPhoneNumber = computed(() => this.authService.userProfile()?.phoneNumber || '');

    userId = computed(() => {
        const uid = this.authService.userProfile()?.uid;
        if (!uid) return 'MR-XXXXX';
        // If it looks like a long UUID, take first 5 chars, otherwise use as is
        const shortId = uid.length > 8 ? uid.substring(0, 5).toUpperCase() : uid;
        return `MR-${shortId}`;
    });

    pageTitle = computed(() => {
        const url = this.router.url;
        const item = this.menuItems.find(i => url.includes(i.route));
        return item ? item.label : 'Dashboard';
    });

    toggleSidebar() {
        this.isSidebarOpen.update(v => !v);
    }

    closeSidebar() {
        // Only auto-close if we are on a mobile/tablet view (typically where it overlaps)
        if (window.innerWidth <= 1024) {
            this.isSidebarOpen.set(false);
        }
    }

    ngOnInit() {
        // Initial checks
    }

    async logout() {
        await this.authService.logout();
    }
}
