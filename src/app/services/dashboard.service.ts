import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ProvisioningDashboard {
    status: 'Ordered' | 'Preparing' | 'Provisioning';
    planPaidFor: string;
    amountPaid: string;
    paymentDate: string;
}

export interface NormalDashboard {
    status: 'Completed' | 'Active';
    currentSubscription: string;
    amount: string;
    endDate: string;
    installationAddress: string;
    recommendedUpgrades: any[];
}

export type DashboardResponse = ProvisioningDashboard | NormalDashboard;

export interface PaymentHistoryItem {
    id: string;
    paymentId: string;
    invoiceNumber: string;
    amount: string;
    status: string;
    paymentDate: string;
    description: string;
}

export interface PaymentHistoryResponse {
    data: PaymentHistoryItem[];
    summary: {
        totalPaidYtd: string;
        nextPaymentDate: string;
    };
    meta: {
        total: number;
        currentPage: number;
        lastPage: number;
    };
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;
    loaded = signal(false);

    async getDashboard(): Promise<DashboardResponse> {
        return firstValueFrom(
            this.http.get<DashboardResponse>(`${this.apiUrl}/customer-auth/dashboard`)
        );
    }

    async getPaymentHistory(params: {
        page?: number;
        status?: 'paid' | 'pending';
        lastSixMonths?: boolean
    }): Promise<PaymentHistoryResponse> {
        let httpParams = new HttpParams();
        if (params.page) httpParams = httpParams.set('page', params.page.toString());
        if (params.status) httpParams = httpParams.set('status', params.status);
        if (params.lastSixMonths) httpParams = httpParams.set('lastSixMonths', 'true');

        return firstValueFrom(
            this.http.get<PaymentHistoryResponse>(`${this.apiUrl}/customer-auth/payments/history`, {
                params: httpParams
            })
        );
    }

    async downloadInvoice(paymentId: string): Promise<Blob> {
        return firstValueFrom(
            this.http.get(`${this.apiUrl}/customer-auth/payments/${paymentId}/invoice-pdf`, {
                responseType: 'blob'
            })
        );
    }
}

