import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing',
  imports: [CommonModule, FormsModule],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class LandingComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  activeServiceType: 'home' | 'business' = 'home';
  mobileMenuOpen = false;
  touchStartX = 0;
  touchEndX = 0;
  currentYear = new Date().getFullYear();

  constructor(private cdr: ChangeDetectorRef) { }

  homePlans = [
    {
      name: 'Essential',
      speed: '50 Mbps',
      tag: 'Best Value',
      tagClass: 'best-value',
      price: '20,000',
      featured: false,
      features: ['Unlimited data', 'Free WiFi Gateway', 'Free installation', 'Basic technical support']
    },
    {
      name: 'Premium',
      speed: '100 Mbps',
      tag: 'Full Fibre',
      tagClass: 'full-fibre',
      price: '38,250',
      featured: true,
      badge: 'Most Popular',
      features: ['Unlimited data', 'Free WiFi Gateway', 'Free installation', 'Standard technical support', 'Smart home ready']
    },
    {
      name: 'Ultra',
      speed: '300 Mbps',
      tag: 'Fast',
      tagClass: 'fast',
      price: '85,000',
      featured: false,
      features: ['Unlimited data', 'Free WiFi Gateway', 'Free installation', 'Priority technical support', 'Smart home ready']
    },
    {
      name: 'Gigabit',
      speed: '500 Mbps',
      tag: 'Fast',
      tagClass: 'fast',
      price: '139,500',
      featured: false,
      features: ['Unlimited data', 'Free WiFi Gateway', 'Free installation', 'Premium technical support', 'Gaming & 4K streaming']
    },
    {
      name: 'Ultrafast',
      speed: '1000 Mbps',
      tag: 'Full Fibre',
      tagClass: 'full-fibre',
      price: '252,000',
      featured: false,
      features: ['Unlimited data', 'Free WiFi Gateway', 'Free installation', '24/7 premium support', '4K streaming & smart home ready']
    }
  ];

  businessPlans = [
    {
      name: 'Small Business',
      speed: '50 Mbps CIR',
      tag: 'Guaranteed Bandwidth',
      tagClass: 'full-fibre',
      price: '90,000',
      featured: false,
      features: ['Unlimited data', 'Business-grade router', 'Static IP included', '24/7 business support', '99.9% uptime SLA', 'CIR guaranteed bandwidth']
    },
    {
      name: 'Growing Business',
      speed: '100 Mbps CIR',
      tag: 'Guaranteed Bandwidth',
      tagClass: 'full-fibre',
      price: '170,000',
      featured: true,
      badge: 'Most Popular',
      features: ['Unlimited data', 'Enterprise router', '2 Static IPs included', '24/7 priority support', '99.95% uptime SLA', 'Dedicated account manager']
    },
    {
      name: 'Established Business',
      speed: '300 Mbps CIR',
      tag: 'Guaranteed Bandwidth',
      tagClass: 'full-fibre',
      price: '380,000',
      featured: false,
      features: ['Unlimited data', 'Advanced enterprise router', '5 Static IPs included', '24/7 premium support', '99.99% uptime SLA', 'Network security suite']
    },
    {
      name: 'Large Enterprise',
      speed: '500 Mbps CIR',
      tag: 'Guaranteed Bandwidth',
      tagClass: 'full-fibre',
      price: '625,000',
      featured: false,
      features: ['Unlimited data', 'Carrier-grade equipment', '10 Static IPs included', '24/7 dedicated support', '99.99% uptime SLA', 'Advanced security suite']
    },
    {
      name: 'Corporate Solution',
      speed: '1000 Mbps CIR',
      tag: 'Guaranteed Bandwidth',
      tagClass: 'full-fibre',
      price: '1,130,000',
      featured: false,
      features: ['Unlimited data', 'Redundant carrier-grade equipment', 'Unlimited Static IPs', '24/7 engineer support', '99.999% uptime SLA', 'On-site technician included']
    }
  ];

  get activePlans() {
    return this.activeServiceType === 'home' ? this.homePlans : this.businessPlans;
  }

  slides = [
    {
      subtitle: 'Fibre Deep, Reach Wide',
      title1: 'Free WiFi Gateway',
      title2: 'Included',
      tagline: 'Professional Installation at No Extra Cost',
      description: 'All plans include expert installation and a modern dual - and WiFi - ready to use on day one.',
      cardTitle: 'Free Installation',
      cardSubtitle: ''
    },
    {
      subtitle: 'Fibre Deep, Reach Wide',
      title1: 'Up to 1000Mbps',
      title2: 'Symmetrical Speeds',
      tagline: 'True End-to-End Fibre Connectivity',
      description: 'Fibre runs directly from our core network to your premises - no copper, no slowdowns.',
      cardTitle: '1000 Mbps',
      cardSubtitle: 'Fibre'
    },
    {
      subtitle: 'Fibre Deep, Reach Wide',
      title1: 'Unlimited Data',
      title2: 'No Caps, No Limits',
      tagline: 'Experience True Freedom Online',
      description: 'Stream, game, and work as much as you want without worrying about data limits or throttling.',
      cardTitle: 'Unlimited',
      cardSubtitle: 'Data'
    }
  ];

  autoSlideInterval: any;

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  startAutoSlide() {
    this.stopAutoSlide();
    this.autoSlideInterval = setInterval(() => {
      this.autoNextSlide();
    }, 3000);
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
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

  autoNextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.cdr.detectChanges(); // Manually trigger view update
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

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  setServiceType(type: 'home' | 'business') {
    this.activeServiceType = type;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }
}
