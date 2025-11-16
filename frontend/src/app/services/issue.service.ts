import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Issue, IssueFormData } from '../models/issue.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  private apiUrl = 'http://localhost:5000/api/issues';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAllIssues(): Observable<Issue[]> {
    return this.http.get<Issue[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getMyIssues(): Observable<Issue[]> {
    return this.http.get<Issue[]>(`${this.apiUrl}/my-issues`, { headers: this.getHeaders() });
  }

  getIssue(id: string): Observable<Issue> {
    return this.http.get<Issue>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createIssue(issue: IssueFormData): Observable<Issue> {
    return this.http.post<Issue>(this.apiUrl, issue, { headers: this.getHeaders() });
  }

  updateIssue(id: string, issue: Partial<Issue>): Observable<Issue> {
    return this.http.put<Issue>(`${this.apiUrl}/${id}`, issue, { headers: this.getHeaders() });
  }

  updateIssueStatus(id: string, status: string): Observable<Issue> {
    return this.http.patch<Issue>(
      `${this.apiUrl}/${id}/status`,
      { status },
      { headers: this.getHeaders() }
    );
  }

  deleteIssue(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
