import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './admin.html',
    styleUrl: './admin.scss'
})
export class AdminComponent {
    menuItems = [
        { label: 'Dashboard', icon: 'grid', route: '/admin/dashboard' },
        { label: 'Leads', icon: 'users', route: '/admin/leads' },
        { label: 'Infrastructure', icon: 'database', route: '/admin/infrastructure' },
        { label: 'Settings', icon: 'settings', route: '/admin/settings' }
    ];
}
