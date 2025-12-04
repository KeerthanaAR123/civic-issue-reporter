import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IssueService } from '../../../core/services/issue.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-report-issue',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './report-issue.component.html',
  styleUrl: './report-issue.component.css'
})
export class ReportIssueComponent implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder);
  private issueService = inject(IssueService);
  private router = inject(Router);
  private http = inject(HttpClient);

  reportForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    category: ['', Validators.required],
    address: ['', Validators.required],
    description: ['', Validators.required],
    image: [null]
  });

  selectedFile: File | null = null;
  isSubmitting = false;
  
  private map: any;
  private marker: any;
  private latitude: number = 0;
  private longitude: number = 0;

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    // 1. Initialize Map
    this.map = L.map('map').setView([20.5937, 78.9629], 5);

    // 2. Use CartoDB Voyager tiles (Looks cleaner, more like Google Maps)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href=\'https://www.openstreetmap.org/copyright\'>OSM</a> contributors &copy; <a href=\'https://carto.com/attributions\'>CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(this.map);

    // 3. Define Google-Style Red Icon
    const googleRedIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // 4. Locate User immediately
    this.locateUser(googleRedIcon);

    // ensure map paints correctly if inside a layout with fixed header
    setTimeout(() => {
      try { this.map.invalidateSize(); } catch (e) { /* ignore */ }
    }, 250);
  }

  // Changed to PUBLIC so button can call it
  locateUser(customIcon?: any): void {
    // Use the custom red icon if passed, otherwise recreate it
    const icon = customIcon || new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    if (navigator.geolocation) {
      // Request live system location with maximum accuracy
      // enableHighAccuracy: true → uses GPS (most accurate, takes ~5-10 sec)
      // timeout: 15000 → wait up to 15 seconds for GPS fix
      // maximumAge: 0 → always get fresh location, don't use cached
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const accuracy = position.coords.accuracy;
          console.log('✓ Live Location Found:', { lat, lng, accuracy: accuracy + 'm' });
          
          // ensure map exists
          if (!this.map) {
            this.initMap();
          }

          // immediately set view and marker
          this.map.setView([lat, lng], 16);
          this.addMarker(lat, lng, icon);

          // ensure map layout recalculates (fixes leaflet tiles/controls overlapping fixed header)
          setTimeout(() => { try { this.map.invalidateSize(); } catch(e){} }, 200);

          // set a temporary address (coordinates) so the form becomes valid
          this.reportForm.patchValue({ address: `${lat.toFixed(5)}, ${lng.toFixed(5)}` });

          // try reverse geocoding; if it fails we'll keep the coordinate fallback
          this.getAddress(lat, lng);
        },
        (err) => {
          console.warn('⚠ Geolocation error:', err.code, err.message);
          console.warn('Error codes: 1=Permission Denied, 2=Position Unavailable, 3=Timeout');
          
          if (err.code === 1) {
            alert('Location permission denied. Please enable location access in your browser settings.');
          } else if (err.code === 3) {
            alert('Location request timed out. Please ensure you have GPS or WiFi enabled.');
          }
          // User can manually drag marker or retry with button
        },
        { 
          enableHighAccuracy: true,    // Use GPS for maximum accuracy
          timeout: 15000,              // Wait up to 15 seconds for GPS fix
          maximumAge: 0                // Always get fresh location, don't use cache
        }
      );
    } else {
      console.warn('✗ Geolocation not supported by this browser');
      alert('Geolocation is not supported by your browser. Please use Chrome, Firefox, Safari, or Edge.');
    }
  }

  private addMarker(lat: number, lng: number, icon: any): void {
    if (this.marker) this.map.removeLayer(this.marker);
    
    this.marker = L.marker([lat, lng], { draggable: true, icon: icon }).addTo(this.map);
    
    // store coordinates when marker is created
    this.latitude = lat;
    this.longitude = lng;

    this.marker.on('dragend', () => {
      const pos = this.marker.getLatLng();
      this.latitude = pos.lat;
      this.longitude = pos.lng;
      this.getAddress(pos.lat, pos.lng);
    });
  }

  private getAddress(lat: number, lng: number): void {
    const url = 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lng;
    this.http.get(url).subscribe((data: any) => {
      if (data && data.display_name) {
        this.reportForm.patchValue({ address: data.display_name });
      }
    }, (err) => {
      // Reverse geocoding failed (CORS, rate-limit, etc). Keep coordinate fallback.
      console.warn('Reverse geocoding failed:', err);
      this.reportForm.patchValue({ address: `${lat.toFixed(5)}, ${lng.toFixed(5)}` });
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (this.reportForm.invalid) {
      alert('Please fill all required fields');
      return;
    }
    this.isSubmitting = true;
    const formData = new FormData();
    Object.keys(this.reportForm.controls).forEach(key => {
      formData.append(key, this.reportForm.get(key)?.value);
    });
    // append captured coordinates
    formData.append('latitude', this.latitude.toString());
    formData.append('longitude', this.longitude.toString());
    if (this.selectedFile) formData.append('image', this.selectedFile);

    this.issueService.createIssue(formData).subscribe({
      next: () => {
        alert('Report Submitted Successfully!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Submission error:', err);
        alert('Failed to submit report: ' + (err.error?.message || err.message || 'Unknown error'));
      }
    });
  }
}

