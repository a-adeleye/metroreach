import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadService } from '../../services/lead.service';
import { Subscription, map } from 'rxjs';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
    private leadService = inject(LeadService);
    private subscription: Subscription | null = null;

    leadsCount = signal<number>(0);

    ngOnInit() {
        this.subscription = this.leadService.getLeads().pipe(
            map(leads => leads ? leads.length : 0)
        ).subscribe({
            next: (count) => {
                console.log('AdminDashboard: Updated count:', count);
                this.leadsCount.set(count);
            },
            error: (err) => {
                console.error('AdminDashboard: Error fetching lead count:', err);
            }
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
