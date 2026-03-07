import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SubscriptionService } from '../../services/subscription.service';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-checkout-cancel',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './cancel.html',
    styleUrl: './cancel.scss'
})
export class CheckoutCancelComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private subscriptionService = inject(SubscriptionService);

    paymentId: string | null = null;
    txRef: string | null = null;
    status: string | null = null;
    isLoading = false;
    error: string | null = null;

    ngOnInit(): void {
        this.paymentId = this.route.snapshot.queryParamMap.get('paymentId');
        this.txRef = this.route.snapshot.queryParamMap.get('txRef');
        this.status = this.route.snapshot.queryParamMap.get('status') || 'cancelled';
    }

    get isFailed(): boolean {
        return this.status === 'failed';
    }

    retryPayment(): void {
        if (!this.paymentId) {
            this.error = 'Payment ID is missing. Please try starting the checkout again.';
            return;
        }

        this.isLoading = true;
        this.error = null;

        this.subscriptionService.retryPayment(this.paymentId)
            .pipe(finalize(() => this.isLoading = false))
            .subscribe({
                next: (response) => {
                    if (response?.checkoutUrl) {
                        window.location.href = response.checkoutUrl;
                    } else {
                        this.error = 'Failed to generate retry link. Please contact support.';
                    }
                },
                error: (err) => {
                    this.error = 'An error occurred while retrying payment. Please try again.';
                    console.error('Retry error:', err);
                }
            });
    }

    goHome(): void {
        this.router.navigate(['/']);
    }
}
