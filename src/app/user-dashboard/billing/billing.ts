import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { DashboardService, PaymentHistoryItem, PaymentHistoryResponse } from '../../services/dashboard.service';

@Component({
    selector: 'app-billing',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './billing.html',
    styleUrl: './billing.scss'
})
export class BillingComponent implements OnInit {
    protected authService = inject(AuthService);
    private dashboardService = inject(DashboardService);

    // Summary signals
    totalPaidYTD = signal('0.00');
    nextPaymentDate = signal('N/A');

    // History signals
    history = signal<PaymentHistoryItem[]>([]);
    isLoading = signal(true);

    // Pagination signals
    currentPage = signal(1);
    totalPages = signal(1);

    // Filter signals
    statusFilter = signal<'paid' | 'pending' | undefined>(undefined);
    lastSixMonths = signal(false);

    async ngOnInit() {
        await this.fetchHistory();
    }

    async fetchHistory(page: number = 1) {
        this.isLoading.set(true);
        try {
            const response = await this.dashboardService.getPaymentHistory({
                page,
                status: this.statusFilter(),
                lastSixMonths: this.lastSixMonths()
            });

            this.history.set(response.data);
            this.totalPaidYTD.set(response.summary.totalPaidYtd);
            this.nextPaymentDate.set(response.summary.nextPaymentDate);

            this.currentPage.set(response.meta.currentPage);
            this.totalPages.set(response.meta.lastPage);
        } catch (error) {
            console.error('Failed to fetch payment history', error);
        } finally {
            this.isLoading.set(false);
        }
    }

    async changePage(page: number) {
        if (page >= 1 && page <= this.totalPages()) {
            await this.fetchHistory(page);
        }
    }

    async toggleStatusFilter(status?: 'paid' | 'pending') {
        this.statusFilter.set(status);
        await this.fetchHistory(1);
    }

    async toggleLastSixMonths(val: boolean) {
        this.lastSixMonths.set(val);
        await this.fetchHistory(1);
    }

    // Error handling
    downloadError = signal<string | null>(null);

    async downloadInvoice(id: string) {
        this.downloadError.set(null);
        try {
            const blob = await this.dashboardService.downloadInvoice(id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Invoice-${id}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Failed to download invoice', error);
            this.downloadError.set('Could not download invoice. Please try again later.');
            setTimeout(() => this.downloadError.set(null), 5000);
        }
    }
}
