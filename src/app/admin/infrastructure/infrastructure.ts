import { Component, signal } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';

export interface Location {
    id: string;
    name: string;
    status: 'online' | 'planned' | 'maintenance';
    coverage: string;
    capacity: string;
    clients: number;
}

@Component({
    selector: 'app-infrastructure',
    standalone: true,
    imports: [CommonModule, TitleCasePipe],
    templateUrl: './infrastructure.html',
    styleUrl: './infrastructure.scss'
})
export class InfrastructureComponent {
    locations = signal<Location[]>([
        { id: '1', name: 'Victoria Island Central', status: 'online', coverage: '98%', capacity: '10 Gbps', clients: 450 },
        { id: '2', name: 'Lekki Phase 1', status: 'online', coverage: '95%', capacity: '10 Gbps', clients: 320 },
        { id: '3', name: 'Ikoyi North', status: 'maintenance', coverage: '85%', capacity: '5 Gbps', clients: 180 },
        { id: '4', name: 'Ikeja Gra', status: 'planned', coverage: '0%', capacity: '10 Gbps', clients: 0 },
        { id: '5', name: 'Maryland Hub', status: 'online', coverage: '99%', capacity: '20 Gbps', clients: 890 }
    ]);
}
