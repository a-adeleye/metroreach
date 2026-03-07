import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-checkout-success',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './success.html',
    styleUrl: './success.scss'
})
export class CheckoutSuccessComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    paymentId: string | null = null;
    txRef: string | null = null;

    ngOnInit(): void {
        this.paymentId = this.route.snapshot.queryParamMap.get('paymentId');
        this.txRef = this.route.snapshot.queryParamMap.get('txRef');
    }

    goToLogin(): void {
        this.router.navigate(['/login']);
    }
}
