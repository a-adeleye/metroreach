import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-support',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './support.html',
    styleUrl: './support.scss'
})
export class SupportComponent {
    protected authService = inject(AuthService);

    supportCategories = [
        { title: 'Technical Help', icon: 'tool', desc: 'Troubleshoot your connection and hardware' },
        { title: 'Billing Questions', icon: 'credit-card', desc: 'Invoices, payments and plan changes' },
        { title: 'New Services', icon: 'zap', desc: 'Upgrade speed or add new fibre lines' },
        { title: 'Security', icon: 'shield', desc: 'Account privacy and safety settings' }
    ];

    faqs = [
        { q: 'How do I restart my MetroReach Router?', a: 'Locate the power button on the back of the G1 Gateway, press it once to turn off, wait 10 seconds, and press again.' },
        { q: 'What is the "Speed Boost" feature?', a: 'Speed Boost temporarily increases your connection priority during peak hours to ensure consistent performance for gaming and streaming.' }
    ];
}
