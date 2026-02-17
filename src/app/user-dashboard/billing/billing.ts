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
    nextPayment = {
        date: 'March 15, 2026',
        amount: '38,250'
    };

    history = [
        { id: '#INV-5842', date: 'Feb 15, 2026', amount: '38,250', status: 'Paid', method: 'MasterCard •••• 4412' },
        { id: '#INV-4921', date: 'Jan 15, 2026', amount: '38,250', status: 'Paid', method: 'MasterCard •••• 4412' },
        { id: '#INV-3820', date: 'Dec 15, 2025', amount: '38,250', status: 'Paid', method: 'Bank Transfer' },
        { id: '#INV-2710', date: 'Nov 15, 2025', amount: '38,250', status: 'Paid', method: 'Bank Transfer' }
    ];
}
