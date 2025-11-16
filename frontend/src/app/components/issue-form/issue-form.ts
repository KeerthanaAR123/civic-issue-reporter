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
  issue: IssueFormData = {
    title: '',
    description: '',
    category: 'Infrastructure',
    location: '',
    priority: 'Medium'
  };

  categories = ['Infrastructure', 'Sanitation', 'Safety', 'Environment', 'Other'];
  priorities = ['Low', 'Medium', 'High'];
  
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private issueService: IssueService,
    public router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    this.issueService.createIssue(this.issue).subscribe({
      next: () => {
        this.successMessage = 'Issue reported successfully!';
        setTimeout(() => {
          this.router.navigate(['/my-issues']);
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Failed to report issue. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
