import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing';
import { AdminComponent } from './admin/admin';
import { DashboardComponent as AdminDashboardComponent } from './admin/dashboard/dashboard';
import { LeadsComponent } from './admin/leads/leads';
import { LoginComponent } from './auth/login';
import { InfrastructureComponent } from './admin/infrastructure/infrastructure';
import { UserDashboardComponent } from './user-dashboard/user-dashboard';
import { OverviewComponent as UserOverviewComponent } from './user-dashboard/overview/overview';
import { ProfileComponent as UserProfileComponent } from './user-dashboard/profile/profile';
import { PlanComponent as UserPlanComponent } from './user-dashboard/plan/plan';
import { BillingComponent as UserBillingComponent } from './user-dashboard/billing/billing';
import { SupportComponent as UserSupportComponent } from './user-dashboard/support/support';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'login', component: LoginComponent },
    {
        path: 'dashboard',
        component: UserDashboardComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'overview', pathMatch: 'full' },
            { path: 'overview', component: UserOverviewComponent },
            { path: 'profile', component: UserProfileComponent },
            { path: 'plan', component: UserPlanComponent },
            { path: 'billing', component: UserBillingComponent },
            { path: 'support', component: UserSupportComponent },
            { path: '**', redirectTo: 'overview' }
        ]
    },
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [adminGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: AdminDashboardComponent },
            { path: 'leads', component: LeadsComponent },
            { path: 'infrastructure', component: InfrastructureComponent },
            { path: '**', redirectTo: 'dashboard' }
        ]
    }
];
