import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SubscriptionPlan {
    id: string;
    code: string;
    name: string;
    description: string | null;
    speedMbps: number;
    monthlyPrice: number;
    currency: string;
    interval: string;
    duration: number;
    features: string[];
    featured?: boolean;
    badge?: string;
    tag?: string;
    tagClass?: string;
}

export interface CheckoutSessionRequest {
    planId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    stateId?: string;
    cityId?: string;
    zoneId?: string;
    areaId?: string;
    lat?: number;
    lng?: number;
}

export interface CheckoutSessionResponse {
    paymentId: string;
    checkoutUrl: string;
}

@Injectable({
    providedIn: 'root'
})
export class SubscriptionService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    getPublicPlans(): Observable<SubscriptionPlan[]> {
        return this.http.get<SubscriptionPlan[]>(`${this.apiUrl}/public/subscription-plans`);
    }

    createCheckoutSession(data: CheckoutSessionRequest): Observable<CheckoutSessionResponse> {
        return this.http.post<CheckoutSessionResponse>(`${this.apiUrl}/billing/payments/checkout-sessions`, data);
    }

    retryPayment(paymentId: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/billing/payments/${paymentId}/retry`, {});
    }
}
