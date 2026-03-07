import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing';
import { LoginComponent } from './auth/login';
import { ChangePasswordComponent } from './auth/change-password/change-password';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password';

import { UserDashboardComponent } from './user-dashboard/user-dashboard';
import { OverviewComponent as UserOverviewComponent } from './user-dashboard/overview/overview';
import { ProfileComponent as UserProfileComponent } from './user-dashboard/profile/profile';
import { BillingComponent as UserBillingComponent } from './user-dashboard/billing/billing';
import { SupportComponent as UserSupportComponent } from './user-dashboard/support/support';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { CheckoutSuccessComponent } from './checkout/success/success';
import { CheckoutCancelComponent } from './checkout/cancel/cancel';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
    { path: 'change-password', component: ChangePasswordComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [guestGuard] },

    { path: 'checkout/success', component: CheckoutSuccessComponent },
    { path: 'checkout/cancel', component: CheckoutCancelComponent },
    {
        path: 'dashboard',
        component: UserDashboardComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'overview', pathMatch: 'full' },
            { path: 'overview', component: UserOverviewComponent },
            { path: 'profile', component: UserProfileComponent },
            { path: 'billing', component: UserBillingComponent },
            { path: 'support', component: UserSupportComponent },
            { path: '**', redirectTo: 'overview' }
        ]
    }
];
