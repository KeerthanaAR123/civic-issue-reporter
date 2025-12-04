import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { trigger, style, animate, transition, query, stagger } from '@angular/animations';
import { IssueService } from '../../core/services/issue.service';
import { AdminService } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {
  private issueService = inject(IssueService);
  private adminService = inject(AdminService);
  public authService = inject(AuthService); // Public so HTML can see it
  
  issues: any[] = [];
  stats = { total: 0, resolved: 0, pending: 0, inProgress: 0 };
  statusOptions = ['Reported', 'In Progress', 'Resolved'];
  categoryOptions = ['Road Infrastructure', 'Waste Management', 'Public Safety', 'Water Supply', 'Other'];
  
  selectedCategory = '';
  selectedStatus = '';

  ngOnInit() {
    this.fetchIssues();
    if (this.authService.isAdmin()) {
      this.fetchStats();
    }
  }

  fetchIssues() {
    if (this.authService.isAdmin()) {
      this.adminService.getAllIssues(this.selectedCategory, this.selectedStatus).subscribe({
        next: (data) => {
          this.issues = data;
          this.calculateStats();
        },
        error: (err) => console.error('Error fetching issues:', err)
      });
    } else {
      this.issueService.getIssues().subscribe({
        next: (data) => {
          this.issues = data;
          this.calculateStats();
        },
        error: (err) => console.error('Error fetching issues:', err)
      });
    }
  }

  fetchStats() {
    this.adminService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => console.error('Error fetching stats:', err)
    });
  }

  calculateStats() {
    this.stats.total = this.issues.length;
    this.stats.resolved = this.issues.filter(i => i.status === 'Resolved').length;
    this.stats.pending = this.issues.filter(i => i.status === 'Reported').length;
    this.stats.inProgress = this.issues.filter(i => i.status === 'In Progress').length;
  }

  onCategoryChange() {
    this.fetchIssues();
  }

  onStatusChange(issue: any, newStatus: string) {
    if (this.authService.isAdmin()) {
      this.adminService.updateIssueStatus(issue._id, newStatus).subscribe({
        next: (updated) => {
          issue.status = updated.status;
          this.calculateStats();
        },
        error: (err) => alert('Failed to update status')
      });
    } else {
      this.issueService.updateStatus(issue._id, newStatus).subscribe({
        next: (updated) => {
          issue.status = updated.status;
          this.calculateStats();
        },
        error: (err) => alert('Failed to update status')
      });
    }
  }

  deleteIssue(id: string) {
    if(confirm('Are you sure you want to delete this issue?')) {
      if (this.authService.isAdmin()) {
        this.adminService.deleteIssue(id).subscribe({
          next: () => {
            this.issues = this.issues.filter(i => i._id !== id);
            this.calculateStats();
          },
          error: (err) => alert('Failed to delete issue')
        });
      } else {
        this.issueService.deleteIssue(id).subscribe({
          next: () => {
            this.issues = this.issues.filter(i => i._id !== id);
            this.calculateStats();
          },
          error: (err) => alert('Failed to delete issue')
        });
      }
    }
  }

  getStatusColor(status: string): string {
    if (status === 'Resolved') return 'bg-green-100 text-green-700 border-green-200';
    if (status === 'In Progress') return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  }

  getImageUrl(issue: any): string {
    if (!issue.imageUrl) {
      return 'https://placehold.co/600x400?text=No+Image';
    }
    // If it is a Cloudinary URL
    if (issue.imageUrl.startsWith('http')) {
      return issue.imageUrl;
    }
    // If it is a Local File, fix slashes and add localhost
    const cleanPath = issue.imageUrl.replace(/\\\\/g, '/');
    return 'http://localhost:5000/' + cleanPath;
  }
}
