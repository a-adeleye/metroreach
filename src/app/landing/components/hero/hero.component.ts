import { Component, OnInit, OnDestroy, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Slide {
  subtitle: string;
  title1: string;
  title2: string;
  tagline: string;
  description: string;
  cardTitle: string;
  cardSubtitle: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() slides: Slide[] = [];
  @Output() scrollToSection = new EventEmitter<string>();

  currentSlide = 0;
  touchStartX = 0;
  touchEndX = 0;
  private autoSlideInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    this.startAutoSlide();
  }

  ngAfterViewInit() {
    this.initTouchListeners();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  private initTouchListeners() {
    const carousel = document.getElementById('hero-carousel');
    if (carousel) {
      carousel.addEventListener('touchstart', (e: TouchEvent) => this.onTouchStart(e), { passive: true });
      carousel.addEventListener('touchend', (e: TouchEvent) => this.onTouchEnd(e), { passive: true });
    }
  }

  startAutoSlide() {
    this.stopAutoSlide();
    this.autoSlideInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }, 3000);
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  resetAutoSlide() {
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  setSlide(index: number) {
    this.currentSlide = index;
    this.resetAutoSlide();
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.resetAutoSlide();
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.resetAutoSlide();
  }

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  handleSwipe() {
    if (this.touchEndX < this.touchStartX - 50) {
      this.nextSlide();
    }
    if (this.touchEndX > this.touchStartX + 50) {
      this.prevSlide();
    }
  }

  onScrollToSection(sectionId: string) {
    this.scrollToSection.emit(sectionId);
  }
}
