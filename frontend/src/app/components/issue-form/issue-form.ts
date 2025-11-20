import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IssueService } from '../../services/issue.service';
import { IssueFormData } from '../../models/issue.model';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-issue-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './issue-form.html',
  styleUrls: ['./issue-form.css']
})
export class IssueFormComponent {
  // Extended issue form data to align with backend
  issue: IssueFormData = {
    title: '',
    description: '',
    category: 'Infrastructure',
    // old single field, still used as human-readable address
    location: '',
    priority: 'Medium',
    // new optional fields
    subCategory: '',
    latitude: undefined,
    longitude: undefined,
    departmentId: ''
  };

  categories = ['Infrastructure', 'Sanitation', 'Safety', 'Environment', 'Other'];
  priorities = ['Low', 'Medium', 'High'];

  // subcategories per category
  subCategoriesMap: { [key: string]: string[] } = {
    Infrastructure: ['Pothole', 'Broken Road', 'Street Light Pole', 'Sidewalk Damage'],
    Sanitation: ['Garbage Overflow', 'Blocked Drain', 'Public Bin Damage'],
    Safety: ['Streetlight Not Working', 'Open Manhole', 'Accident-prone Spot'],
    Environment: ['Illegal Dumping', 'Tree Cutting', 'Pollution'],
    Other: []
  };

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private issueService: IssueService,
    public router: Router
  ) {}

  // Helper to get subcategories for the selected main category
  get currentSubCategories(): string[] {
    const list = this.subCategoriesMap[this.issue.category];
    return list || [];
  }

  // Use browser geolocation to fill latitude/longitude
  useCurrentLocation(): void {
    if (!navigator.geolocation) {
      this.errorMessage = 'Geolocation is not supported by your browser.';
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.issue.latitude = position.coords.latitude;
        this.issue.longitude = position.coords.longitude;
      },
      (error) => {
        console.error('Geolocation error:', error);
        this.errorMessage = 'Unable to get current location. Please allow location access or enter manually.';
      }
    );
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    // Map frontend fields to backend payload
    const payload: any = {
      title: this.issue.title,
      description: this.issue.description,
      category: this.issue.category,
      subCategory: this.issue.subCategory || undefined,
      locationAddress: this.issue.location,        // maps to location.address
      latitude: this.issue.latitude,
      longitude: this.issue.longitude,
      priority: this.issue.priority,
      departmentId: this.issue.departmentId || undefined
    };

    this.issueService.createIssue(payload).subscribe({
      next: () => {
        this.successMessage = 'Issue reported successfully!';
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/my-issues']);
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to report issue. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
