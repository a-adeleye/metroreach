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

        this.subscription = this.leadService.getAll().subscribe({
            next: (data: any[]) => {
                console.log('AdminLeads: Received data:', data);
                this.leads.set(
                    data.map((lead) => ({
                        ...lead,
                        createdAt: this.coerceToDate(lead?.createdAt)
                    }))
                );
                this.isLoading.set(false);
            },
            error: (err: any) => {
                console.error('AdminLeads: Error fetching leads:', err);
                this.isLoading.set(false);
            }
        });
    }

    formatDate(timestamp: any): string {
        const date = this.coerceToDate(timestamp);
        return date ? date.toLocaleString() : 'N/A';
    }

    private coerceToDate(value: any): Date | null {
        if (!value) {
            return null;
        }

        if (value instanceof Date) {
            return Number.isNaN(value.getTime()) ? null : value;
        }

        if (typeof value === 'string' || typeof value === 'number') {
            const date = new Date(value);
            return Number.isNaN(date.getTime()) ? null : date;
        }

        if (typeof value === 'object') {
            if (typeof value.toDate === 'function') {
                const date = value.toDate();
                return date instanceof Date && !Number.isNaN(date.getTime()) ? date : null;
            }

            const seconds = value.seconds ?? value._seconds;
            const nanoseconds = value.nanoseconds ?? value._nanoseconds ?? 0;
            if (typeof seconds === 'number') {
                const milliseconds = (seconds * 1000) + Math.floor(nanoseconds / 1_000_000);
                const date = new Date(milliseconds);
                return Number.isNaN(date.getTime()) ? null : date;
            }
        }

        return null;
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
