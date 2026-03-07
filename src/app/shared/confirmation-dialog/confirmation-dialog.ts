import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-confirmation-dialog',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="modal-backdrop" *ngIf="show" (click)="onCancel()">
            <div class="modal-container" (click)="$event.stopPropagation()">
                <div class="modal-header">
                    <h3>{{ title }}</h3>
                </div>
                <div class="modal-body">
                    <p>{{ message }}</p>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancel" (click)="onCancel()">Cancel</button>
                    <button class="btn-confirm" (click)="onConfirm()" [disabled]="isLoading">
                        {{ isLoading ? 'Processing...' : confirmText }}
                    </button>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .modal-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            backdrop-filter: blur(4px);
            animation: fadeIn 0.3s ease-out;
        }

        .modal-container {
            background: white;
            padding: 32px;
            border-radius: 16px;
            width: 90%;
            max-width: 450px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            animation: slideUp 0.3s ease-out;
        }

        .modal-header h3 {
            margin: 0 0 16px;
            color: #0c1a30;
            font-size: 20px;
        }

        .modal-body p {
            margin: 0 0 32px;
            color: #4f5e71;
            line-height: 1.6;
        }

        .modal-footer {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        }

        button {
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
        }

        .btn-cancel {
            background: #f1f5f9;
            color: #475569;
        }

        .btn-cancel:hover {
            background: #e2e8f0;
        }

        .btn-confirm {
            background: #166534;
            color: white;
        }

        .btn-confirm:hover {
            background: #14532d;
        }

        .btn-confirm:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `]
})
export class ConfirmationDialogComponent {
    @Input() show = false;
    @Input() title = 'Confirm Action';
    @Input() message = 'Are you sure you want to proceed?';
    @Input() confirmText = 'Confirm';
    @Input() isLoading = false;

    @Output() confirm = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();

    onConfirm() {
        this.confirm.emit();
    }

    onCancel() {
        if (!this.isLoading) {
            this.cancel.emit();
        }
    }
}
