import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  @Output() scrollToSection = new EventEmitter<string>();

  currentYear = new Date().getFullYear();

  onScrollToSection(sectionId: string) {
    this.scrollToSection.emit(sectionId);
  }
}
