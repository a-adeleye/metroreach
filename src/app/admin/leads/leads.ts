import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadService } from '../../services/lead.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-admin-leads',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './leads.html',
    styleUrl: './leads.scss'
})
export class LeadsComponent implements OnInit {
    private leadService = inject(LeadService);
    leads$: Observable<any[]> = new Observable<any[]>();

    ngOnInit() {
        this.leads$ = this.leadService.getLeads();
    }

    formatDate(timestamp: any): string {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString();
    }
}
