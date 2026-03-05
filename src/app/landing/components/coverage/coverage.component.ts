import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-coverage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coverage.component.html',
  styleUrl: './coverage.component.scss',
})
export class CoverageComponent implements AfterViewInit, OnDestroy {
  private coverageMap: any;
  private mapObserver: IntersectionObserver | null = null;
  private mapInitialized = false;

  ngAfterViewInit() {
    this.initCoverageMap();
  }

  ngOnDestroy() {
    this.mapObserver?.disconnect();
  }

  private initCoverageMap() {
    if (typeof window === 'undefined') return;

    const mapElement = document.getElementById('coverage-map');
    if (!mapElement) return;

    this.mapObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.mapInitialized) {
            this.mapInitialized = true;
            this.loadLeafletMap();
            this.mapObserver?.disconnect();
          }
        });
      },
      { rootMargin: '100px' }
    );

    this.mapObserver.observe(mapElement);
  }

  private async loadLeafletMap() {
    try {
      const L = await import('leaflet');
      this.coverageMap = L.map('coverage-map').setView([6.4426, 3.4116], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
      }).addTo(this.coverageMap);
    } catch (error) {
      console.error('Error loading Leaflet:', error);
    }
  }
}
