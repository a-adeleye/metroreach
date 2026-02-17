import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { LeadService } from '../../services/lead.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-admin-leads',
    standalone: true,
    templateUrl: './leads.html',
    imports: [
        CommonModule,
        TitleCasePipe
    ],
    styleUrl: './leads.scss'
})
export class LeadsComponent implements OnInit, OnDestroy {
    private leadService = inject(LeadService);
    private subscription: Subscription | null = null;

    leads = signal<any[]>([]);
    isLoading = signal<boolean>(true);

    ngOnInit() {
        this.loadLeads();
    }

    loadLeads() {
        this.isLoading.set(true);
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        this.leadService.getAll().subscribe({
            next: (data) => {
                console.log('AdminLeads: Received data:', data);
                this.leads.set(data);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('AdminLeads: Error fetching leads:', err);
                this.isLoading.set(false);
            }
        });
    }

    formatDate(timestamp: any): string {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString();
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
