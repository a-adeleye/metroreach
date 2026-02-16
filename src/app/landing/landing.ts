import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule, GoogleMap, MapAdvancedMarker } from '@angular/google-maps';
import { CommonService } from '../services/common.service';
import { LeadService } from '../services/lead.service';

@Component({
  selector: 'app-landing',
  imports: [CommonModule, FormsModule, GoogleMapsModule],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class LandingComponent implements OnInit, OnDestroy, AfterViewInit {
  private commonService = inject(CommonService);
  private leadService = inject(LeadService);
  @ViewChild(GoogleMap) googleMap!: GoogleMap;
  @ViewChild(MapAdvancedMarker) mapMarker!: MapAdvancedMarker;

  currentSlide = 0;
  activeServiceType: 'home' | 'business' = 'home';
  mobileMenuOpen = false;
  touchStartX = 0;
  touchEndX = 0;
  currentYear = new Date().getFullYear();
  searchAddress = '';
  addressSelected = false;
  mapLoading = false;
  showOverlay = false;
  overlayStep: 'loading' | 'success' | 'interest' = 'loading';

  // Interest Form Data
  interestData = {
    fullName: '',
    phoneNumber: '',
    email: ''
  };

  addressMetadata = {
    locality: '',
    localGovernment: '',
    lat: 0,
    lng: 0
  };

  // Error Messages
  errors = {
    address: '',
    fullName: '',
    phoneNumber: '',
    email: ''
  };

  // Google Maps config
  mapCenter = { lat: 6.432, lng: 3.448 };
  mapZoom = 14;
  mapOptions: any = {
    mapId: 'DEMO_MAP_ID',
    disableDefaultUI: false,
    mapTypeControl: true,
    zoomControl: true,
    streetViewControl: false,
    fullscreenControl: false
  };
  markerPosition = { lat: 6.432, lng: 3.448 };
  markerOptions = {
    gmpDraggable: true
  };
  private geocoder: any;

  private autocomplete: any;

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

  ngAfterViewInit() {
    this.initAutocomplete();
    this.initTouchListeners();
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
      const places = await (window as any).google.maps.importLibrary("places");
      const { Place, AutocompleteSuggestion } = places;

      const input = document.getElementById('address-input') as HTMLInputElement;
      if (!input || this.autocomplete) return;

      this.autocomplete = { Place, AutocompleteSuggestion };

      // Create suggestions dropdown
      const wrapper = input.parentElement!;
      const dropdown = document.createElement('div');
      dropdown.className = 'autocomplete-dropdown';
      dropdown.style.cssText = 'position:absolute;top:100%;left:0;right:0;background:#fff;border:1px solid #ddd;border-radius:8px;max-height:250px;overflow-y:auto;z-index:1000;display:none;box-shadow:0 4px 12px rgba(0,0,0,0.15);';
      wrapper.style.position = 'relative';
      wrapper.appendChild(dropdown);

      let debounceTimer: any;

      input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        const query = input.value;
        this.searchAddress = query; // Sync the value immediately

        if (query.length < 3) {
          dropdown.style.display = 'none';
          return;
        }

        debounceTimer = setTimeout(async () => {
          try {
            const request = {
              input: query,
              includedRegionCodes: ['ng'],
              includedPrimaryTypes: ['street_address', 'subpremise', 'premise', 'route']
            };

            const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);

            dropdown.innerHTML = '';
            if (suggestions && suggestions.length > 0) {
              suggestions.forEach((suggestion: any) => {
                const item = document.createElement('div');
                item.style.cssText = 'padding:12px 16px;cursor:pointer;border-bottom:1px solid #eee;font-size:14px;';
                item.textContent = suggestion.placePrediction?.text?.text || 'Unknown';
                item.addEventListener('mouseenter', () => item.style.background = '#f5f5f5');
                item.addEventListener('mouseleave', () => item.style.background = '#fff');
                item.addEventListener('click', async () => {
                  await this.selectSuggestion(suggestion, input, dropdown, Place);
                });
                dropdown.appendChild(item);
              });
              dropdown.style.display = 'block';
            } else {
              dropdown.style.display = 'none';
            }
          } catch (e) {
            console.error('Autocomplete error:', e);
          }
        }, 300);
      });

      // Hide dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target as Node)) {
          dropdown.style.display = 'none';
        }
      });

    } catch (error) {
      console.error('Error initializing autocomplete:', error);
    }
  }

  private async selectSuggestion(suggestion: any, input: HTMLInputElement, dropdown: HTMLElement, Place: any) {
    try {
      const placeId = suggestion.placePrediction?.placeId;
      if (!placeId) return;

      // Show loading state immediately
      this.mapLoading = true;
      dropdown.style.display = 'none';
      input.value = suggestion.placePrediction?.text?.text || 'Loading...';
      this.cdr.detectChanges();

      const startTime = Date.now();
      const place = new Place({ id: placeId });
      await place.fetchFields({ fields: ['displayName', 'formattedAddress', 'location', 'addressComponents'] });

      // Ensure minimum 500ms loading time for smooth UX
      const elapsed = Date.now() - startTime;
      if (elapsed < 500) {
        await new Promise(resolve => setTimeout(resolve, 500 - elapsed));
      }

      const addr = place.formattedAddress || place.displayName?.text || '';

      this.searchAddress = addr;
      this.addressSelected = true;
      this.errors.address = '';
      this.mapLoading = false;
      input.value = addr;

      if (place.location) {
        const lat = typeof place.location.lat === 'function' ? place.location.lat() : place.location.lat;
        const lng = typeof place.location.lng === 'function' ? place.location.lng() : place.location.lng;
        const pos = { lat, lng };

        this.mapCenter = pos;
        this.markerPosition = pos;
        this.mapZoom = 17;

        this.addressMetadata.lat = lat;
        this.addressMetadata.lng = lng;
      }

      // Extract components
      if (place.addressComponents) {
        const components = place.addressComponents;
        const locality = components.find((c: any) => c.types.includes('locality'))?.longText || '';
        const lga = components.find((c: any) => c.types.includes('administrative_area_level_2'))?.longText || '';

        this.addressMetadata.locality = locality;
        this.addressMetadata.localGovernment = lga;
      }

      this.cdr.detectChanges();
    } catch (e) {
      console.error('Error selecting place:', e);
      this.mapLoading = false;
      this.cdr.detectChanges();
    }
  }

  async onMarkerDragEnd(event: google.maps.MapMouseEvent) {
    if (!event.latLng) return;

    const pos = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };

    this.markerPosition = pos;
    this.mapLoading = true;
    this.cdr.detectChanges();

    try {
      // Initialize geocoder if needed
      if (!this.geocoder) {
        const { Geocoder } = await (window as any).google.maps.importLibrary("geocoding");
        this.geocoder = new Geocoder();
      }

      const response = await this.geocoder.geocode({ location: pos });

      if (response.results && response.results[0]) {
        const result = response.results[0];
        const addr = result.formatted_address;
        const input = document.getElementById('address-input') as HTMLInputElement;

        this.searchAddress = addr;
        this.addressSelected = true;
        this.errors.address = '';
        if (input) input.value = addr;

        // Update metadata
        this.addressMetadata.lat = pos.lat;
        this.addressMetadata.lng = pos.lng;

        const components = result.address_components;
        const locality = components.find((c: any) => c.types.includes('locality'))?.long_name || '';
        const lga = components.find((c: any) => c.types.includes('administrative_area_level_2'))?.long_name || '';

        this.addressMetadata.locality = locality;
        this.addressMetadata.localGovernment = lga;
      }
    } catch (e) {
      console.error('Reverse geocoding error:', e);
    }

    this.mapLoading = false;
    this.cdr.detectChanges();
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
    this.cdr.detectChanges();
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

    setTimeout(() => {
      const addr = this.searchAddress.toLowerCase();
      console.log('Processing address:', addr);

      if (addr.includes('oniru') || addr.includes('ikoyi') || addr.includes('vi')) {
        this.overlayStep = 'success';
      } else {
        this.overlayStep = 'interest';
      }

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

  async submitInterest() {
    // Final check for address from the DOM
    const addrInput = document.getElementById('address-input') as HTMLInputElement;
    if (addrInput) this.searchAddress = addrInput.value;

    if (!this.validateInterestForm()) return;

    this.commonService.setLoading(true);

    try {
      const data = {
        fullName: this.interestData.fullName,
        phoneNumber: this.interestData.phoneNumber,
        email: this.interestData.email,
        address: this.searchAddress,
        serviceType: this.activeServiceType
      };

      console.log('Sending lead to service:', data);

      await this.leadService.createLead(data, this.addressMetadata);

      // Small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 600));

      this.commonService.setLoading(false);
      this.commonService.showToast('Great! Your interest has been registered.', 'success');
      this.closeOverlay();
      this.resetForm();
    } catch (error) {
      console.error('Error submitting interest:', error);
      this.commonService.setLoading(false);
      this.commonService.showToast('Something went wrong. Please try again.', 'error');
    }
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

  resetForm() {
    // Reset Data
    this.interestData = {
      fullName: '',
      phoneNumber: '',
      email: ''
    };
    this.addressMetadata = {
      locality: '',
      localGovernment: '',
      lat: 0,
      lng: 0
    };
    this.searchAddress = '';
    this.addressSelected = false;

    // Reset Input DOM
    const addrInput = document.getElementById('address-input') as HTMLInputElement;
    if (addrInput) addrInput.value = '';

    // Reset Map
    const initialPos = { lat: 6.432, lng: 3.448 };
    this.mapCenter = initialPos;
    this.markerPosition = initialPos;
    this.mapZoom = 14;

    this.cdr.detectChanges();
  }
}
