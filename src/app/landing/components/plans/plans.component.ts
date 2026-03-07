import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionPlan } from '../../../services/subscription.service';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.scss',
})
export class PlansComponent {
  @Input() homePlans: SubscriptionPlan[] = [];
  @Input() businessPlans: SubscriptionPlan[] = [];
  @Input() activeServiceType: 'home' | 'business' = 'home';
  @Output() serviceTypeChange = new EventEmitter<'home' | 'business'>();
  @Output() selectPlan = new EventEmitter<SubscriptionPlan>();

  get activePlans(): SubscriptionPlan[] {
    return this.activeServiceType === 'home' ? this.homePlans : this.businessPlans;
  }

  setServiceType(type: 'home' | 'business') {
    this.serviceTypeChange.emit(type);
  }
}
