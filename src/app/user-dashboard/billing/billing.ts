import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-billing',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './billing.html',
    styleUrl: './billing.scss'
})
export class BillingComponent {
    protected authService = inject(AuthService);

    balance = signal('0.00');
    totalPaidYTD = signal('382,500');
    outstanding = signal('0.00');
    nextPayment = {
        date: 'Oct 24, 2024',
        amount: '38,250'
    };

    history = [
        { id: 'INV-2024-009', date: 'Sep 24, 2024', description: 'Monthly Subscription - Premium 100 Mbps', amount: '38,250', status: 'Paid' },
        { id: 'INV-2024-008', date: 'Aug 24, 2024', description: 'Monthly Subscription - Premium 100 Mbps', amount: '38,250', status: 'Paid' },
        { id: 'INV-2024-007', date: 'Jul 24, 2024', description: 'Mesh WiFi Unit Purchase (x2)', amount: '72,000', status: 'Paid' },
        { id: 'INV-2024-006', date: 'Jun 24, 2024', description: 'Monthly Subscription - Premium 100 Mbps', amount: '38,250', status: 'Paid' },
        { id: 'INV-2024-005', date: 'Jun 24, 2024', description: 'Monthly Subscription - Premium 100 Mbps', amount: '38,250', status: 'Pending' },
        { id: 'INV-2024-001', date: 'Jan 15, 2024', description: 'Installation Fee + First Month', amount: '85,000', status: 'Paid' }
    ];
}
