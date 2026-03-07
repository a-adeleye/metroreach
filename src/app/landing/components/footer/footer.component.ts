import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  @Input() appVersion = '1.0.0';
  @Output() scrollToSection = new EventEmitter<string>();

  currentYear = new Date().getFullYear();

  onScrollToSection(sectionId: string) {
    this.scrollToSection.emit(sectionId);
  }
}
