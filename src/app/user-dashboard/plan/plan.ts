import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-my-plan',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './plan.html',
    styleUrl: './plan.scss'
})
export class PlanComponent {
    protected authService = inject(AuthService);

    activePlan = signal({
        name: 'Premium Full Fibre',
        tagline: 'Symmetrical speeds for high-demand homes',
        downloadSpeed: '100 Mbps',
        uploadSpeed: '100 Mbps',
        data: 'Unlimited',
        price: '38,250',
        frequency: 'Monthly',
        routerModel: 'Wi-Fi 6 Gateway G1',
        status: 'Connected'
    });

    availableUpgrades = [
        { name: 'Ultra Fibre', speed: '500 Mbps', price: '65,000', popular: true },
        { name: 'Giga Fibre', speed: '1 Gbps', price: '95,000', popular: false }
    ];
}
