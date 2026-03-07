import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../services/common.service';
import { LeadService } from '../services/lead.service';
import { CoverageService, State, City, Zone, Area, CoverageStatus } from '../services/coverage.service';
import { RouterModule } from '@angular/router';
import { CoverageModalComponent } from './coverage-modal/coverage-modal.component';
import { SubscriptionPlan, SubscriptionService } from '../services/subscription.service';

// Sub-components
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { PlansComponent } from './components/plans/plans.component';
import { ServicesComponent } from './components/services/services.component';
import { CoverageComponent } from './components/coverage/coverage.component';
import { SupportComponent } from './components/support/support.component';
import { FooterComponent } from './components/footer/footer.component';

// Sub-components available for future refactoring (see src/app/landing/components/):
// NavbarComponent, HeroComponent, PlansComponent, ServicesComponent,
// CoverageComponent, SupportComponent, FooterComponent

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CoverageModalComponent,
    NavbarComponent,
    HeroComponent,
    PlansComponent,
    ServicesComponent,
    CoverageComponent,
    SupportComponent,
    FooterComponent
  ],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class LandingComponent implements OnInit, OnDestroy, AfterViewInit {
  private commonService = inject(CommonService);
  private leadService = inject(LeadService);
  private coverageService = inject(CoverageService);
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);
  private subscriptionService = inject(SubscriptionService);

  activeServiceType: 'home' | 'business' = 'home';
  currentYear = new Date().getFullYear();
  searchAddress = '';
  appVersion = '1.0.0';
  addressSelected = false;
  mapLoading = false;
  showOverlay = false;
  overlayStep: 'loading' | 'success' | 'interest' | 'interest-success' | 'selection' | 'zone-selection' = 'loading';

  // Coverage Hierarchy
  states: State[] = [];
  cities: City[] = [];
  zones: Zone[] = [];
  areas: Area[] = [];

  selectedStateId = '';
  selectedCityId = '';
  selectedZoneId = '';
  selectedAreaId = '';
  selectedZoneName = '';

  currentStatus: CoverageStatus = 'Live';
  lastLevelSelected: 'state' | 'city' | 'zone' | 'area' | null = null;
  lastSelectedId = '';

  // Interest Form Data
  interestData = {
    fullName: '',
    phoneNumber: '',
    email: ''
  };

  loadingHierarchy = false;
  selectedPlan: SubscriptionPlan | null = null;

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

  // Form submission state
  private isSubmitting = false;
  private lastSubmitTime = 0;
  private readonly SUBMIT_COOLDOWN_MS = 3000;

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

  constructor() { }

  homePlans: SubscriptionPlan[] = [];
  businessPlans: SubscriptionPlan[] = [];

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

  getStatusLabel(status: string): string {
    if (!status) return '';
    if (status.toLowerCase() === 'live') return 'Live';
    return status.replace(/_/g, ' ').replace(/\b\w/g, (value) => value.toUpperCase());
  }

  autoSlideInterval: any;

  ngOnInit() {
    this.loadZones();
    this.loadPlans();
  }

  loadPlans() {
    this.subscriptionService.getPublicPlans().subscribe({
      next: (plans) => {
        // Business plans usually have 'CIR' in name or a specific property, 
        // but the API snippet doesn't show a 'type' field.
        // We'll assume plans with 'Mbps' are home and 'CIR' are business, 
        // or just filter by speed/price if needed.
        // Based on the user request, the response is an array.
        // Let's split them based on price or keywords for now, or just use them as they come.
        // I will assume for now they are all 'home' unless I see otherwise.

        this.homePlans = plans.filter(p => !p.name.toLowerCase().includes('business') && !p.name.toLowerCase().includes('enterprise') && !p.name.toLowerCase().includes('corporate'));
        this.businessPlans = plans.filter(p => p.name.toLowerCase().includes('business') || p.name.toLowerCase().includes('enterprise') || p.name.toLowerCase().includes('corporate'));

        // If all plans go to one bucket, fix it
        if (this.homePlans.length === 0 && plans.length > 0) {
          this.homePlans = plans;
        }

        // Add default tags/classes if missing for the UI
        plans.forEach(p => {
          if (!p.tag) p.tag = 'Full Fibre';
          if (!p.tagClass) p.tagClass = 'full-fibre';
        });

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading plans:', err)
    });
  }

  loadZones() {
    this.ngZone.run(() => {
      this.loadingHierarchy = true;
      this.cdr.detectChanges();
    });

    this.coverageService.getZonesPublic().subscribe({
      next: (zones: Zone[]) => {
        this.ngZone.run(() => {
          this.zones = zones;
          this.loadingHierarchy = false;
          this.cdr.detectChanges();
        });
      },
      error: (err: any) => {
        console.error('Error loading zones:', err);
        this.ngZone.run(() => {
          this.loadingHierarchy = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  loadStates() {
    this.coverageService.getStates().subscribe({
      next: (states: State[]) => {
        this.ngZone.run(() => {
          this.states = states;
          if (this.states.length > 0) {
            this.selectedStateId = this.states[0].id;
            this.onStateChange();
          }
          this.cdr.detectChanges();
        });
      },
      error: (err: any) => console.error('Error loading states:', err)
    });
  }

  onStateChange() {
    this.selectedCityId = '';
    this.selectedZoneId = '';
    this.selectedAreaId = '';
    this.cities = [];
    this.zones = [];
    this.areas = [];

    const state = this.states.find(s => s.id === this.selectedStateId);
    if (!state) return;

    this.currentStatus = state.status?.toLowerCase() === 'live' ? 'Live' : state.status;
    this.lastLevelSelected = 'state';
    this.lastSelectedId = state.id;

    if (state) {
      this.ngZone.run(() => {
        this.loadingHierarchy = true;
        this.cdr.detectChanges();
      });

      this.coverageService.getCities(state.id).subscribe({
        next: (cities: City[]) => {
          this.ngZone.run(() => {
            this.cities = cities;
            this.loadingHierarchy = false;
            this.cdr.detectChanges();
          });
        },
        error: (err: any) => {
          console.error('Error loading cities:', err);
          this.ngZone.run(() => {
            this.loadingHierarchy = false;
            this.cdr.detectChanges();
          });
        }
      });
    }
  }

  onCityChange() {
    this.selectedZoneId = '';
    this.selectedAreaId = '';
    this.zones = [];
    this.areas = [];

    const city = this.cities.find(c => c.id === this.selectedCityId);
    if (!city) return;

    this.currentStatus = city.status?.toLowerCase() === 'live' ? 'Live' : city.status;
    this.lastLevelSelected = 'city';
    this.lastSelectedId = city.id;

    // Launch modal if not already open
    if (!this.showOverlay) {
      this.showOverlay = true;
      this.overlayStep = 'selection';
    }

    if (city.status?.toLowerCase() === 'live') {
      this.loadingHierarchy = true;
      this.coverageService.getZones(city.id).subscribe({
        next: (zones: Zone[]) => {
          this.ngZone.run(() => {
            this.zones = zones;
            this.loadingHierarchy = false;
            this.cdr.detectChanges();
          });
        },
        error: (err: any) => {
          console.error('Error loading zones:', err);
          this.ngZone.run(() => {
            this.loadingHierarchy = false;
            this.cdr.detectChanges();
          });
        }
      });
    } else {
      this.openInterestDialog();
    }
  }

  onZoneChange() {
    this.selectedAreaId = '';
    this.areas = [];

    const zone = this.zones.find(z => z.id === this.selectedZoneId);
    if (!zone) return;

    this.currentStatus = zone.status?.toLowerCase() === 'live' ? 'Live' : zone.status;
    this.lastLevelSelected = 'zone';
    this.lastSelectedId = zone.id;
    this.searchAddress = zone.name;
    this.selectedZoneName = zone.name;

    this.ngZone.run(() => {
      this.showOverlay = true;
      this.overlayStep = 'loading';
      this.loadingHierarchy = true;
      this.cdr.detectChanges();
    });

    this.coverageService.getAreas(zone.id).subscribe({
      next: (areas: Area[]) => {
        this.ngZone.run(() => {
          this.areas = areas;
          this.loadingHierarchy = false;

          if (this.areas.length > 0) {
            this.overlayStep = 'selection';
            if (areas.length === 1) {
              this.selectedAreaId = areas[0].id;
            }
          } else {
            this.openInterestDialog();
          }

          this.cdr.detectChanges();
        });
      },
      error: (err: any) => {
        console.error('Error loading areas:', err);
        this.ngZone.run(() => {
          this.loadingHierarchy = false;
          this.openInterestDialog();
          this.cdr.detectChanges();
        });
      }
    });
  }

  onAreaChange() {
    this.ngZone.run(() => {
      const area = this.areas.find(a => a.id === this.selectedAreaId);
      if (!area) return;

      this.currentStatus = area.status?.toLowerCase() === 'live' ? 'Live' : area.status;
      this.lastLevelSelected = 'area';
      this.lastSelectedId = area.id;

      if (area.status?.toLowerCase() === 'live') {
        this.openSuccessDialog();
      } else {
        this.openInterestDialog();
      }
      this.cdr.detectChanges();
    });
  }

  onZoneSelectByName(name: string) {
    this.ngZone.run(() => {
      const zone = this.zones.find(z => z.name.toLowerCase().includes(name.toLowerCase()));
      if (zone) {
        this.selectedZoneId = zone.id;
        this.onZoneChange();
      } else {
        this.openZoneSelection();
      }
      this.cdr.detectChanges();
    });
  }

  openZoneSelection() {
    this.ngZone.run(() => {
      this.showOverlay = true;
      this.overlayStep = 'zone-selection';
      this.cdr.detectChanges();
    });
  }

  onSelectPlanFromLanding(plan: SubscriptionPlan) {
    this.selectedPlan = plan;
    this.showOverlay = true;
    this.overlayStep = 'zone-selection';
    this.cdr.detectChanges();
    this.scrollToSection('register');
  }

  onSelectPlan(plan: SubscriptionPlan) {
    this.selectedPlan = plan;
    // For "Live" areas, we still need to collect user info before proceeding to checkout
    // So we move to the 'interest' step (form)
    this.overlayStep = 'interest';
    this.cdr.detectChanges();
  }

  private getFullAddressFromSelection(): string {
    const s = this.states.find(x => x.id === this.selectedStateId)?.name || '';
    const c = this.cities.find(x => x.id === this.selectedCityId)?.name || '';
    const z = this.zones.find(x => x.id === this.selectedZoneId)?.name || '';
    const a = this.areas.find(x => x.id === this.selectedAreaId)?.name || '';
    return [a, z, c, s].filter(Boolean).join(', ');
  }

  openSuccessDialog() {
    this.searchAddress = this.getFullAddressFromSelection();
    this.showOverlay = true;
    this.overlayStep = 'success';
    this.cdr.detectChanges();
  }

  openInterestDialog() {
    this.searchAddress = this.getFullAddressFromSelection();
    this.showOverlay = true;
    this.overlayStep = 'interest';
    this.cdr.detectChanges();
    setTimeout(() => {
      this.initAutocomplete();
    }, 100);
  }

  ngOnDestroy() {
    this.mapObserver?.disconnect();
  }

  private coverageMap: any;
  private mapObserver: IntersectionObserver | null = null;
  private mapInitialized = false;

  ngAfterViewInit() {
    this.initAutocomplete();
  }


  private async initAutocomplete(retryCount = 0) {
    if (!(window as any).google || !(window as any).google.maps || !(window as any).google.maps.importLibrary) {
      if (retryCount < 10) {
        setTimeout(() => this.initAutocomplete(retryCount + 1), 500);
      }
      return;
    }

    try {
      if (!this.autocomplete) {
        this.autocomplete = await (window as any).google.maps.importLibrary("places");
      }
      const { Place, AutocompleteSuggestion } = this.autocomplete;

      const input = document.getElementById('address-input') as HTMLInputElement;
      if (!input) return;

      const wrapper = input.parentElement!;
      let dropdown = wrapper.querySelector('.autocomplete-dropdown') as HTMLElement;

      if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.className = 'autocomplete-dropdown';
        dropdown.style.cssText = 'position:absolute;top:100%;left:0;right:0;background:#fff;border:1px solid #ddd;border-radius:8px;max-height:250px;overflow-y:auto;z-index:1000;display:none;box-shadow:0 4px 12px rgba(0,0,0,0.15);';
        wrapper.style.position = 'relative';
        wrapper.appendChild(dropdown);
      }

      let debounceTimer: any;

      input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        const query = input.value;
        this.searchAddress = query;

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

      this.mapLoading = true;
      dropdown.style.display = 'none';
      input.value = suggestion.placePrediction?.text?.text || 'Loading...';
      this.cdr.detectChanges();

      const startTime = Date.now();
      const place = new Place({ id: placeId });
      await place.fetchFields({ fields: ['displayName', 'formattedAddress', 'location', 'addressComponents'] });

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


  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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

    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
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
    // Debounce: prevent rapid submissions
    const now = Date.now();
    if (this.isSubmitting || (now - this.lastSubmitTime) < this.SUBMIT_COOLDOWN_MS) {
      return;
    }

    const addrInput = document.getElementById('address-input') as HTMLInputElement;
    if (addrInput) this.searchAddress = addrInput.value;

    if (!this.validateInterestForm()) return;

    this.isSubmitting = true;
    this.lastSubmitTime = now;
    this.commonService.setLoading(true);

    try {
      const data = {
        fullName: this.interestData.fullName,
        phoneNumber: this.interestData.phoneNumber,
        email: this.interestData.email,
        address: this.searchAddress,
        type: this.activeServiceType,
        stateId: this.selectedStateId || null,
        cityId: this.selectedCityId || null,
        zoneId: this.selectedZoneId || null,
        areaId: this.selectedAreaId || null,
        lat: this.addressMetadata.lat,
        lng: this.addressMetadata.lng,
        planId: this.selectedPlan?.id || null
      };

      if (this.selectedPlan && this.currentStatus === 'Live') {
        // If it's a live area and a plan is selected, create checkout session
        this.subscriptionService.createCheckoutSession(data as any).subscribe({
          next: (res) => {
            if (res.checkoutUrl) {
              window.location.href = res.checkoutUrl;
              // Keep loading states active while the page redirects
            } else {
              this.commonService.setLoading(false);
              this.isSubmitting = false;
              this.overlayStep = 'interest-success';
              this.cdr.detectChanges();
            }
          },
          error: (err) => {
            console.error('Checkout error:', err);
            this.commonService.setLoading(false);
            this.isSubmitting = false;
            this.commonService.showToast('Could not initiate payment. Please try again.', 'error');
          }
        });
      } else {
        // Otherwise just register as a lead
        await this.leadService.publicLead(data as any).toPromise();
        await new Promise(resolve => setTimeout(resolve, 600));

        this.commonService.setLoading(false);
        this.isSubmitting = false;
        this.overlayStep = 'interest-success';
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Error submitting interest:', error);
      this.commonService.setLoading(false);
      this.isSubmitting = false;
      this.commonService.showToast('Something went wrong. Please try again.', 'error');
    }
  }

  closeOverlay() {
    this.showOverlay = false;
    this.overlayStep = 'loading';

    this.selectedStateId = '';
    this.selectedCityId = '';
    this.selectedZoneId = '';
    this.selectedAreaId = '';

    this.cities = [];
    this.areas = [];
    // Keep zones to avoid re-requesting if closing modal
    // OR call loadZones again to refresh
    // For now, let's just clear selection and status.
    this.resetForm();
    this.cdr.detectChanges();
  }

  setServiceType(type: 'home' | 'business') {
    this.activeServiceType = type;
  }


  resetForm() {
    this.currentStatus = 'Live';
    this.selectedPlan = null;
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

    const addrInput = document.getElementById('address-input') as HTMLInputElement;
    if (addrInput) addrInput.value = '';

    const initialPos = { lat: 6.432, lng: 3.448 };
    this.mapCenter = initialPos;
    this.markerPosition = initialPos;
    this.mapZoom = 14;

    this.cdr.detectChanges();
  }

  trackByState(index: number, state: State) {
    return state.id;
  }

  trackByCity(index: number, city: City) {
    return city.id;
  }

  trackByZone(index: number, zone: Zone) {
    return zone.id;
  }

  trackByArea(index: number, area: Area) {
    return area.id;
  }
}
