import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Plan {
  name: string;
  speed: string;
  tag: string;
  tagClass: string;
  price: string;
  featured: boolean;
  badge?: string;
  features: string[];
}

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.scss',
})
export class PlansComponent {
  @Input() homePlans: Plan[] = [];
  @Input() businessPlans: Plan[] = [];
  @Input() activeServiceType: 'home' | 'business' = 'home';
  @Output() serviceTypeChange = new EventEmitter<'home' | 'business'>();
  @Output() scrollToSection = new EventEmitter<string>();

  get activePlans(): Plan[] {
    return this.activeServiceType === 'home' ? this.homePlans : this.businessPlans;
  }

  setServiceType(type: 'home' | 'business') {
    this.serviceTypeChange.emit(type);
  }

  onScrollToSection(sectionId: string) {
    this.scrollToSection.emit(sectionId);
  }
}
