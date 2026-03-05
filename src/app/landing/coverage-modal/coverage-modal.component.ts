import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { Area, City, CoverageStatus, State, Zone } from '../../services/coverage.service';

export type CoverageOverlayStep = 'loading' | 'success' | 'interest' | 'interest-success' | 'selection';

@Component({
  selector: 'app-coverage-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, GoogleMapsModule],
  templateUrl: './coverage-modal.html',
  styleUrl: './coverage-modal.scss',
})
export class CoverageModalComponent {
  @Input() showOverlay = false;
  @Input() overlayStep: CoverageOverlayStep = 'loading';
  @Input() searchAddress = '';
  @Input() selectedZoneName = '';

  @Input() states: State[] = [];
  @Input() cities: City[] = [];
  @Input() zones: Zone[] = [];
  @Input() areas: Area[] = [];

  @Input() selectedStateId = '';
  @Input() selectedCityId = '';
  @Input() selectedZoneId = '';
  @Input() selectedAreaId = '';

  @Input() loadingHierarchy = false;
  @Input() activePlans: any[] = [];
  @Input() currentStatus: CoverageStatus = 'Live';

  @Input() interestData = {
    fullName: '',
    phoneNumber: '',
    email: '',
  };

  @Input() errors = {
    fullName: '',
    phoneNumber: '',
    email: '',
  };

  @Input() mapCenter = { lat: 6.432, lng: 3.448 };
  @Input() mapZoom = 14;
  @Input() mapOptions: any = {};
  @Input() markerPosition = { lat: 6.432, lng: 3.448 };
  @Input() markerOptions: any = { gmpDraggable: true };
  @Input() mapLoading = false;

  @Output() closeOverlay = new EventEmitter<void>();
  @Output() overlayStepChange = new EventEmitter<CoverageOverlayStep>();

  @Output() selectedStateIdChange = new EventEmitter<string>();
  @Output() selectedCityIdChange = new EventEmitter<string>();
  @Output() selectedZoneIdChange = new EventEmitter<string>();
  @Output() selectedAreaIdChange = new EventEmitter<string>();

  @Output() stateChange = new EventEmitter<void>();
  @Output() cityChange = new EventEmitter<void>();
  @Output() zoneChange = new EventEmitter<void>();
  @Output() areaChange = new EventEmitter<void>();

  @Output() selectPlan = new EventEmitter<any>();
  @Output() markerDragEnd = new EventEmitter<google.maps.MapMouseEvent>();
  @Output() submitInterest = new EventEmitter<void>();

  getSelectedAreaStatus(): string {
    const area = this.areas.find(a => a.id === this.selectedAreaId);
    return area?.status || '';
  }

  triggerInterestDialog(): void {
    this.overlayStepChange.emit('interest');
  }

  onAreaSelectCard(area: Area): void {
    this.selectedAreaIdChange.emit(area.id);
    setTimeout(() => {
      this.areaChange.emit();
    }, 50);
  }

  setOverlayStep(step: CoverageOverlayStep): void {
    this.overlayStepChange.emit(step);
  }

  getStatusLabel(status: string): string {
    if (!status) return '';
    if (status.toLowerCase() === 'live') return 'Live';
    return status.replace(/_/g, ' ').replace(/\b\w/g, (value) => value.toUpperCase());
  }
}
