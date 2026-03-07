import { Component, inject, signal, computed, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { DashboardService, DashboardResponse, ProvisioningDashboard, NormalDashboard } from '../../services/dashboard.service';
import { RouterLink } from '@angular/router';


@Component({
    selector: 'app-overview',
    imports: [RouterLink, CommonModule],
    templateUrl: './overview.html',
    styleUrl: './overview.scss'
})
export class OverviewComponent implements OnInit {
    protected authService = inject(AuthService);
    private dashboardService = inject(DashboardService);

    userName = computed(() => {
        const profile = this.authService.userProfile();
        return profile?.firstName || 'User';
    });

    dashboardData = signal<DashboardResponse | null>(null);
    isLoading = signal(true);

    async ngOnInit() {
        try {
            const data = await this.dashboardService.getDashboard();
            this.dashboardData.set(data);
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        } finally {
            this.isLoading.set(false);
            this.dashboardService.loaded.set(true);
        }
    }

    viewMode = signal<'day' | 'week' | 'month'>('week');

    // Mapped signals for Template
    showStatusComponent = computed(() => {
        const data = this.dashboardData();
        if (!data) return false;
        return ['REQUESTED', 'Ordered', 'Preparing', 'Provisioning'].includes(data.status);
    });

    orderStatus = computed(() => {
        const data = this.dashboardData();
        return data?.status || null;
    });

    provisioningData = computed(() => {
        const data = this.dashboardData();
        if (data && 'planPaidFor' in data) {
            return data as ProvisioningDashboard;
        }
        return null;
    });

    normalData = computed(() => {
        const data = this.dashboardData();
        if (data && 'currentSubscription' in data) {
            return data as NormalDashboard;
        }
        return null;
    });

    milestones = [
        { id: 'REQUESTED', label: 'Ordered', description: 'Order confirmed' },
        { id: 'Preparing', label: 'Preparing', description: 'Setting up account' },
        { id: 'Provisioning', label: 'Provisioning', description: 'Configuring network' },
        { id: 'Completed', label: 'Completed', description: 'Service is live' }
    ];

    currentStepIndex = computed(() => {
        const s = this.orderStatus();
        if (!s) return -1;
        // If Completed or Active, mark all steps as done (but showStatusComponent will be false)
        if (s === 'Completed' || s === 'Active') return 3;
        return this.milestones.findIndex(m => m.id === s);
    });

    // Usage Mock Data - Kept as requested
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

