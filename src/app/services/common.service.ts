import { Injectable, signal } from '@angular/core';

export interface Toast {
    message: string;
    type: 'success' | 'error' | 'info';
    duration?: number;
}

@Injectable({
    providedIn: 'root'
})
export class CommonService {
    toast = signal<Toast | null>(null);
    loading = signal<boolean>(false);

    showToast(message: string, type: 'success' | 'error' | 'info' = 'success', duration: number = 4000) {
        this.toast.set({ message, type, duration });
        setTimeout(() => {
            this.toast.set(null);
        }, duration);
    }

    setLoading(state: boolean) {
        this.loading.set(state);
    }
}
