import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-overview',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './overview.html',
    styleUrl: './overview.scss'
})
export class OverviewComponent {
    protected authService = inject(AuthService);

    viewMode = signal<'day' | 'week' | 'month'>('week');

    userPlan = signal({
        name: 'Premium Full Fibre',
        speed: '100 Mbps',
        price: '38,250',
        nextBilling: 'March 15, 2026',
        status: 'Active'
    });

    stats = signal([
        { label: 'Data Used', value: '450 GB', sub: 'Unlimited Plan', icon: 'zap' },
        { label: 'Uptime', value: '99.9%', sub: 'Last 30 Days', icon: 'activity' },
        { label: 'Connected', value: '12 Devices', sub: 'Via WiFi Gateway', icon: 'wifi' }
    ]);

    // Usage Mock Data
    usageData = signal([
        { label: 'Mon', value: 65, secondary: 40 },
        { label: 'Tue', value: 85, secondary: 50 },
        { label: 'Wed', value: 45, secondary: 30 },
        { label: 'Thu', value: 95, secondary: 60 },
        { label: 'Fri', value: 75, secondary: 45 },
        { label: 'Sat', value: 120, secondary: 80 },
        { label: 'Sun', value: 110, secondary: 70 },
    ]);

    // Computed paths for the SVG Line Chart
    downloadPath = computed(() => this.generatePath(this.usageData().map(d => d.value)));
    uploadPath = computed(() => this.generatePath(this.usageData().map(d => d.secondary)));

    // Points for tooltips/interaction
    chartPoints = computed(() => {
        const data = this.usageData();
        const width = 1000;
        const height = 200;
        const step = width / (data.length - 1 || 1);

        return data.map((d, i) => ({
            x: i * step,
            y1: height - (d.value / 150) * height,
            y2: height - (d.secondary / 150) * height,
            label: d.label,
            val1: d.value,
            val2: d.secondary
        }));
    });

    private generatePath(values: number[]): string {
        const width = 1000;
        const height = 200;
        const maxVal = 150; // Max fixed scale for normalization
        const step = width / (values.length - 1 || 1);

        return values.map((v, i) => {
            const x = i * step;
            const y = height - (v / maxVal) * height;
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');
    }

    changeView(mode: 'day' | 'week' | 'month') {
        this.viewMode.set(mode);

        let labels: string[] = [];
        let count = 0;

        if (mode === 'day') {
            labels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'];
            count = 7;
        } else if (mode === 'week') {
            labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            count = 7;
        } else {
            labels = ['W1', 'W2', 'W3', 'W4'];
            count = 12; // More points for smoother month curve
            labels = Array.from({ length: 12 }, (_, i) => i % 3 === 0 ? `D${i + 1}` : '');
        }

        const newData = Array.from({ length: count }, (_, i) => {
            const multiplier = mode === 'month' ? 1.5 : mode === 'day' ? 0.4 : 1;
            return {
                label: labels[i] || '',
                value: Math.floor(Math.random() * 100 * multiplier) + 20,
                secondary: Math.floor(Math.random() * 60 * multiplier) + 10
            };
        });

        this.usageData.set(newData);
    }
}
