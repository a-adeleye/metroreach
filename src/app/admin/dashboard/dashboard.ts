import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadService } from '../../services/lead.service';
import { Observable, map } from 'rxjs';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
    private leadService = inject(LeadService);
    leadsCount$: Observable<number> = new Observable<number>();

    ngOnInit() {
        this.leadsCount$ = this.leadService.getLeads().pipe(
            map(leads => leads ? leads.length : 0)
        );
    }
}
