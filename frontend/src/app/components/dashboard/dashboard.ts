import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IssueService } from '../../services/issue.service';
import { Issue } from '../../models/issue.model';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  issues: Issue[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private issueService: IssueService) {}

  ngOnInit(): void {
    this.loadIssues();
  }

  loadIssues(): void {
    this.issueService.getAllIssues().subscribe({
      next: (data) => {
        this.issues = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load issues';
        this.isLoading = false;
        console.error(error);
      }
    });
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getPriorityColor(priority: string): string {
    switch(priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-orange-100 text-orange-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
