import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing';
import { AdminComponent } from './admin/admin';
import { DashboardComponent } from './admin/dashboard/dashboard';
import { LeadsComponent } from './admin/leads/leads';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    {
        path: 'admin',
        component: AdminComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'leads', component: LeadsComponent },
            { path: '**', redirectTo: 'dashboard' }
        ]
    }
];
