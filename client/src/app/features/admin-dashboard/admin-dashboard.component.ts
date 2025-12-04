import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, style, animate, transition } from '@angular/animations';
import { AdminService } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  public authService = inject(AuthService);
  
  issues: any[] = [];
  stats = { total: 0, resolved: 0, pending: 0, inProgress: 0 };
  statusOptions = ['Reported', 'In Progress', 'Resolved'];
  categoryOptions = ['Road Infrastructure', 'Waste Management', 'Public Safety', 'Water Supply', 'Other'];
  
  selectedCategory = '';
  selectedStatus = '';
  selectedIssue: any = null;
  adminResponse = '';
  showResponseModal = false;

  ngOnInit() {
    this.fetchIssues();
    this.fetchStats();
  }

  fetchIssues() {
    this.adminService.getAllIssues(this.selectedCategory, this.selectedStatus).subscribe({
      next: (data) => {
        this.issues = data;
        this.calculateStats();
      },
      error: (err) => console.error('Error fetching issues:', err)
    });
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
    this.adminService.updateIssueStatus(issue._id, newStatus).subscribe({
      next: (updated) => {
        issue.status = updated.status;
        this.calculateStats();
      },
      error: (err) => alert('Failed to update status')
    });
  }

  deleteIssue(id: string) {
    if(confirm('Are you sure you want to delete this issue?')) {
      this.adminService.deleteIssue(id).subscribe({
        next: () => {
          this.issues = this.issues.filter(i => i._id !== id);
          this.calculateStats();
          alert('Issue deleted successfully');
        },
        error: (err) => alert('Failed to delete issue')
      });
    }
  }

  openResponseModal(issue: any) {
    this.selectedIssue = issue;
    this.adminResponse = issue.adminResponse || '';
    this.showResponseModal = true;
  }

  closeResponseModal() {
    this.showResponseModal = false;
    this.selectedIssue = null;
    this.adminResponse = '';
  }

  submitResponse() {
    if (!this.adminResponse.trim()) {
      alert('Please enter a response');
      return;
    }

    this.adminService.addAdminResponse(this.selectedIssue._id, this.adminResponse).subscribe({
      next: (updated) => {
        this.selectedIssue.adminResponse = updated.adminResponse;
        const issueIndex = this.issues.findIndex(i => i._id === this.selectedIssue._id);
        if (issueIndex !== -1) {
          this.issues[issueIndex] = updated;
        }
        this.closeResponseModal();
        alert('Response added successfully');
      },
      error: (err) => alert('Failed to add response')
    });
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
    if (issue.imageUrl.startsWith('http')) {
      return issue.imageUrl;
    }
    const cleanPath = issue.imageUrl.replace(/\\\\/g, '/');
    return 'http://localhost:5000/' + cleanPath;
  }
}
