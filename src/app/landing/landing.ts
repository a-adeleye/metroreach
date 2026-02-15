import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing',
  imports: [CommonModule, FormsModule],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class LandingComponent implements OnInit, OnDestroy, AfterViewInit {
  currentSlide = 0;
  activeServiceType: 'home' | 'business' = 'home';
  mobileMenuOpen = false;
  touchStartX = 0;
  touchEndX = 0;
  currentYear = new Date().getFullYear();
  searchAddress = '';
  addressSelected = false;
  showOverlay = false;
  overlayStep: 'loading' | 'success' | 'interest' = 'loading';

  // Interest Form Data
  interestData = {
    fullName: '',
    phoneNumber: '',
    email: ''
  };

  // Error Messages
  errors = {
    address: '',
    fullName: '',
    phoneNumber: '',
    email: ''
  };

  // Google Maps Objects
  private map: any;
  private marker: any;
  private autocomplete: any;

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) { }

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

  ngAfterViewInit() {
    this.initAutocomplete();
    this.initTouchListeners();
    // Default location for MetroReach area (VI/Oniru/Ikoyi)
    const defaultLoc = { lat: 6.432, lng: 3.448 };
    this.initMap(defaultLoc);
  }

  private initTouchListeners() {
    const carousel = document.getElementById('hero-carousel');
    if (carousel) {
      carousel.addEventListener('touchstart', (e: any) => this.onTouchStart(e), { passive: true });
      carousel.addEventListener('touchend', (e: any) => this.onTouchEnd(e), { passive: true });
    }
  }

  private async initAutocomplete(retryCount = 0) {
    if (!(window as any).google || !(window as any).google.maps || !(window as any).google.maps.importLibrary) {
      if (retryCount < 10) {
        setTimeout(() => this.initAutocomplete(retryCount + 1), 500);
      }
      return;
    }

    try {
      const { PlaceAutocompleteElement } = await (window as any).google.maps.importLibrary("places");

      const wrapper = document.querySelector('.address-group .autocomplete-wrapper');
      const oldInput = document.getElementById('address-input') as HTMLInputElement;

      if (!wrapper || !oldInput) {
        if (retryCount < 5) setTimeout(() => this.initAutocomplete(retryCount + 1), 500);
        return;
      }

      // Check if already initialized
      if (this.autocomplete) return;

      const placeAutocomplete = new PlaceAutocompleteElement({
        componentRestrictions: { country: 'ng' },
        types: ['address']
      });

      this.autocomplete = placeAutocomplete;
      oldInput.style.display = 'none';
      wrapper.appendChild(placeAutocomplete);
      placeAutocomplete.setAttribute('placeholder', 'Start typing your street address...');

      console.log('PlaceAutocompleteElement created and appended');

      console.log(PlaceAutocompleteElement);


      placeAutocomplete.addEventListener('gmp-placeselect', async (event: any) => {
        console.log('gmp-placeselect event:', event);
        console.log('event.place:', event.place);
        console.log('event.detail:', event.detail);

        const place = event.place || event.detail?.place || event.detail;

        if (!place) {
          console.warn('No place in event');
          return;
        }

        try {
          await place.fetchFields({ fields: ['displayName', 'formattedAddress', 'location'] });

          const addr = place.formattedAddress ||
            (place.displayName?.text) ||
            (typeof place.displayName === 'string' ? place.displayName : '');

          console.log('Fetched address:', addr);

          if (!addr || addr.length < 3) return;

          this.ngZone.run(() => {
            this.searchAddress = addr;
            this.addressSelected = true;
            this.errors.address = '';

            if (place.location) {
              this.updateMapLocation(place.location);
            }
          });
        } catch (e) {
          console.error('Error fetching place fields:', e);
        }
      });

    } catch (error) {
      console.error('Error initializing PlaceAutocompleteElement:', error);
    }
  }

  private updateMapLocation(location: any) {
    if (!location) return;

    // Convert LatLng to plain object if needed
    const pos = typeof location.lat === 'function'
      ? { lat: location.lat(), lng: location.lng() }
      : location;

    console.log('Updating map to position:', pos);

    if (this.map) {
      this.map.setCenter(pos);
      this.map.setZoom(17);
      if (this.marker) {
        this.marker.position = pos;
      }
    } else {
      this.initMap(pos);
    }
  }

  private async initMap(location: any) {
    if (!location) return;

    try {
      const { Map } = await (window as any).google.maps.importLibrary("maps");
      const { AdvancedMarkerElement } = await (window as any).google.maps.importLibrary("marker");

      const mapElement = document.getElementById('sidebar-map');
      if (!mapElement) return;

      // If map already exists, just update it
      if (this.map) {
        this.updateMapLocation(location);
        return;
      }

      this.map = new Map(mapElement, {
        center: location,
        zoom: 14, // Zoomed out a bit for default view
        mapId: 'DEMO_MAP_ID',
        disableDefaultUI: true
      });

      this.marker = new AdvancedMarkerElement({
        map: this.map,
        position: location,
        gmpDraggable: true,
        title: 'MetroReach Area'
      });

    } catch (error) {
      console.error('Error in initMap:', error);
    }
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

  // Coverage & Overlay Logic
  onAddressFocus() {
    console.log('Address input focused');
  }

  validateAddress(): boolean {
    this.errors.address = '';
    if (!this.searchAddress || this.searchAddress.length < 5) {
      this.errors.address = 'Please enter your full installation address.';
      return false;
    }
    if (!this.addressSelected) {
      this.errors.address = 'Please select a valid address from the suggestions.';
      return false;
    }
    return true;
  }

  checkAvailability() {
    if (!this.validateAddress()) return;

    console.log('Checking availability for:', this.searchAddress);

    this.showOverlay = true;
    this.overlayStep = 'loading';
    this.cdr.detectChanges();

    // Simulated Infrastructure Check
    setTimeout(() => {
      const addr = this.searchAddress.toLowerCase();
      console.log('Timeout fired. Processing address:', addr);

      // Oniru is our live demo zone
      if (addr.includes('oniru') || addr.includes('ikoyi') || addr.includes('vi')) {
        this.overlayStep = 'success';
      } else {
        this.overlayStep = 'interest';
      }

      console.log('New overlay step:', this.overlayStep);
      this.cdr.detectChanges();
    }, 1500);
  }

  validateInterestForm(): boolean {
    let isValid = true;
    this.errors.fullName = '';
    this.errors.phoneNumber = '';
    this.errors.email = '';

    if (!this.interestData.fullName || this.interestData.fullName.length < 3) {
      this.errors.fullName = 'Please enter your full name.';
      isValid = false;
    }

    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/;
    if (!this.interestData.phoneNumber || !phoneRegex.test(this.interestData.phoneNumber)) {
      this.errors.phoneNumber = 'Please enter a valid phone number.';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.interestData.email || !emailRegex.test(this.interestData.email)) {
      this.errors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    return isValid;
  }

  submitInterest() {
    if (!this.validateInterestForm()) return;

    console.log('Submitting interest:', this.interestData);
    // Simulate API call
    alert('Thank you for your interest! We will contact you soon.');
    this.closeOverlay();
  }

  closeOverlay() {
    this.showOverlay = false;
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
